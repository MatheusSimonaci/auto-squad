"""
edit-video.py — Automação de edição de vídeo para o agente de marketing

Combina cenas MP4 + narrações MP3, gera legendas automáticas via Whisper,
concatena tudo e adiciona trilha sonora.

Uso (pipeline completo — modo legado):
    python integrations/video-editor/edit-video.py \\
        --assets-dir "C:\\path\\to\\assets" \\
        --parts parte1 parte2 parte3 parte4 \\
        --no-subtitle parte3 \\
        --bgm "C:\\path\\to\\musica.mp3" \\
        --output "C:\\path\\to\\assets\\final.mp4"

Uso (subcomandos individuais):
    python integrations/video-editor/edit-video.py burn-srt --video v.mp4 --srt v.srt --output out.mp4
    python integrations/video-editor/edit-video.py concat-transitions --videos a.mp4 b.mp4 --output out.mp4
    python integrations/video-editor/edit-video.py add-timed-audio --video v.mp4 --clips '[...]' --output out.mp4
    python integrations/video-editor/edit-video.py mix-bgm --video v.mp4 --bgm music.mp3 --output out.mp4

Dependências:
    pip install -r integrations/video-editor/requirements.txt
    ffmpeg >= 4.3 deve estar no PATH do sistema.
"""

import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime
from pathlib import Path

__all__ = [
    'combine_audio_video',
    'transcribe_audio',
    'burn_subtitles',
    'concat_videos',
    'concat_videos_with_transitions',
    'mix_background_music',
    'add_timed_audio',
    'edit_video',
]

# Subcomandos reconhecidos — qualquer outro argv[1] roteia para o parser legado
_SUBCOMMANDS = {'burn-srt', 'concat-transitions', 'add-timed-audio', 'mix-bgm'}


# ---------------------------------------------------------------------------
# Utilitários
# ---------------------------------------------------------------------------

def run(cmd: list[str], check: bool = True) -> subprocess.CompletedProcess:
    """Executa comando e retorna resultado. Falha com mensagem clara se check=True."""
    result = subprocess.run(cmd, capture_output=True, text=True)
    if check and result.returncode != 0:
        print(f"❌  Comando falhou: {' '.join(cmd)}", file=sys.stderr)
        print(result.stderr, file=sys.stderr)
        sys.exit(1)
    return result


def get_duration(file_path: str) -> float:
    """Retorna duração de áudio/vídeo em segundos via ffprobe."""
    result = run([
        'ffprobe', '-v', 'error',
        '-show_entries', 'format=duration',
        '-of', 'json',
        file_path
    ])
    data = json.loads(result.stdout)
    return float(data['format']['duration'])


def seconds_to_srt_time(secs: float) -> str:
    """Converte segundos em timestamp SRT: HH:MM:SS,mmm"""
    hours   = int(secs // 3600)
    minutes = int((secs % 3600) // 60)
    seconds = int(secs % 60)
    millis  = int((secs - int(secs)) * 1000)
    return f"{hours:02}:{minutes:02}:{seconds:02},{millis:03}"


def _make_result(output_path: str, extra: dict | None = None) -> dict:
    """Constrói dict de resultado padrão para todos os subcomandos."""
    output_abs = str(Path(output_path).resolve())
    duration = get_duration(output_abs)
    result = {
        'success': True,
        'output_path': output_abs,
        'duration_seconds': round(duration, 2),
        'timestamp': datetime.now().isoformat(),
    }
    if extra:
        result.update(extra)
    return result


# ---------------------------------------------------------------------------
# Etapa A — Combinar vídeo + narração MP3 para cada parte
# ---------------------------------------------------------------------------

def combine_audio_video(video_path: str, audio_path: str, output_path: str) -> None:
    """Substitui (ou adiciona) a faixa de áudio do vídeo pela narração MP3."""
    run([
        'ffmpeg', '-y',
        '-i', video_path,
        '-i', audio_path,
        '-map', '0:v:0',   # vídeo do arquivo original
        '-map', '1:a:0',   # áudio da narração
        '-c:v', 'copy',
        '-c:a', 'aac',
        '-shortest',       # termina quando o mais curto acabar
        output_path
    ])


# ---------------------------------------------------------------------------
# Etapa B — Gerar legenda via Whisper + gravar legenda no vídeo
# ---------------------------------------------------------------------------

def transcribe_audio(audio_path: str, output_dir: str) -> str:
    """
    Usa Whisper CLI para transcrever o MP3 e gerar arquivo .srt.
    Retorna o caminho do .srt gerado.
    """
    run([
        'whisper', audio_path,
        '--output_format', 'srt',
        '--output_dir', output_dir,
        '--language', 'Portuguese',
        '--model', 'base',   # rápido; trocar por 'small' para mais precisão
    ])

    audio_stem = Path(audio_path).stem
    srt_path = os.path.join(output_dir, f"{audio_stem}.srt")

    if not os.path.exists(srt_path):
        raise FileNotFoundError(f"Whisper não gerou o SRT esperado em: {srt_path}")

    return srt_path


def generate_srt_from_text(text: str, audio_path: str, output_dir: str) -> str:
    """
    Gera um arquivo .srt com uma entrada por palavra, distribuindo o tempo
    uniformemente pela duração do áudio.

    Args:
        text:       Texto de narração da parte (extraído do card ClickUp).
        audio_path: Caminho do MP3 — usado para obter a duração total.
        output_dir: Pasta onde o .srt será salvo.

    Returns:
        Caminho absoluto do arquivo .srt gerado.
    """
    duration   = get_duration(audio_path)
    audio_stem = Path(audio_path).stem
    srt_path   = os.path.join(output_dir, f"{audio_stem}.srt")

    words = text.strip().split()
    if not words:
        words = [text.strip()]

    interval = duration / len(words)

    with open(srt_path, 'w', encoding='utf-8') as f:
        for i, word in enumerate(words):
            start = seconds_to_srt_time(i * interval)
            end   = seconds_to_srt_time((i + 1) * interval)
            f.write(f"{i + 1}\n{start} --> {end}\n{word}\n\n")

    return srt_path


def burn_subtitles(video_path: str, srt_path: str, output_path: str) -> None:
    """
    Grava legendas diretamente no vídeo (hardcoded subtitles).
    Aceita qualquer arquivo .srt — gerado pelo Whisper ou fornecido manualmente.
    """
    # Normaliza path para ffmpeg (barras forward mesmo no Windows)
    srt_escaped = srt_path.replace('\\', '/').replace(':', '\\:')

    run([
        'ffmpeg', '-y',
        '-i', video_path,
        '-vf', f"subtitles='{srt_escaped}':force_style='FontSize=18,Bold=1,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=2,Alignment=2'",
        '-c:a', 'copy',
        output_path
    ])


# ---------------------------------------------------------------------------
# Etapa C — Concatenar todas as partes
# ---------------------------------------------------------------------------

def concat_videos(video_paths: list[str], output_path: str) -> None:
    """Concatena múltiplos vídeos usando FFmpeg concat demuxer (sem re-encoding)."""
    with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False, encoding='utf-8') as f:
        for vp in video_paths:
            safe_path = vp.replace('\\', '/')
            f.write(f"file '{safe_path}'\n")
        list_file = f.name

    try:
        run([
            'ffmpeg', '-y',
            '-f', 'concat',
            '-safe', '0',
            '-i', list_file,
            '-c', 'copy',
            output_path
        ])
    finally:
        os.unlink(list_file)


def concat_videos_with_transitions(
    video_paths: list[str],
    output_path: str,
    transition: str = 'xfade',
    duration: float = 0.5,
) -> None:
    """
    Concatena vídeos com transição xfade/crossfade entre cada par de clips.

    Requer re-encoding (libx264 + aac). Para concatenação sem transição e sem
    re-encoding, use concat_videos().

    Requer FFmpeg >= 4.3 (filtro xfade).

    Args:
        video_paths:  Lista de caminhos MP4 na ordem de montagem.
        output_path:  Caminho do vídeo de saída (MP4).
        transition:   Tipo de transição xfade (ex: 'xfade', 'fade', 'wipeleft',
                      'wiperight', 'slideleft', 'slideright', 'circleopen').
        duration:     Duração da transição em segundos (padrão: 0.5).
    """
    if len(video_paths) == 1:
        shutil.copy(video_paths[0], output_path)
        return

    # Durações de cada clip para calcular os offsets
    durations = [get_duration(vp) for vp in video_paths]

    inputs = []
    for vp in video_paths:
        inputs += ['-i', vp]

    n = len(video_paths)
    v_filters = []
    a_filters = []
    cumulative_offset = 0.0

    for i in range(n - 1):
        in_v = f'[v{i:02d}]' if i > 0 else f'[{i}:v]'
        in_a = f'[a{i:02d}]' if i > 0 else f'[{i}:a]'
        is_last = (i == n - 2)
        out_v = '[vout]' if is_last else f'[v{i+1:02d}]'
        out_a = '[aout]' if is_last else f'[a{i+1:02d}]'

        # Offset acumulado; epsilon evita erro "offset must be before end of clip"
        cumulative_offset += durations[i] - duration
        safe_offset = max(0.0, cumulative_offset - 0.01)

        v_filters.append(
            f'{in_v}[{i+1}:v]xfade=transition={transition}:'
            f'duration={duration}:offset={safe_offset:.4f}{out_v}'
        )
        a_filters.append(
            f'{in_a}[{i+1}:a]acrossfade=d={duration}{out_a}'
        )

    filter_complex = ';'.join(v_filters + a_filters)

    run([
        'ffmpeg', '-y',
        *inputs,
        '-filter_complex', filter_complex,
        '-map', '[vout]',
        '-map', '[aout]',
        '-c:v', 'libx264', '-crf', '18', '-preset', 'fast',
        '-c:a', 'aac',
        output_path
    ])


# ---------------------------------------------------------------------------
# Etapa D — Mixar trilha sonora de fundo (com trim automático)
# ---------------------------------------------------------------------------

def mix_background_music(
    video_path: str,
    bgm_path: str,
    output_path: str,
    bgm_volume: float = 0.20,
) -> None:
    """
    Corta a música de fundo para a duração exata do vídeo e mixa com o áudio
    existente em uma única passagem FFmpeg.

    A BGM é loopada automaticamente se for mais curta que o vídeo.
    O vídeo original não é re-encodado (-c:v copy).

    Args:
        video_path:  Caminho do vídeo de entrada (MP4).
        bgm_path:    Caminho da música de fundo (MP3/M4A).
        output_path: Caminho do vídeo de saída (MP4).
        bgm_volume:  Volume da BGM em relação ao áudio original (padrão: 0.20).
    """
    video_duration = get_duration(video_path)

    run([
        'ffmpeg', '-y',
        '-i', video_path,
        '-stream_loop', '-1', '-t', str(video_duration), '-i', bgm_path,
        '-filter_complex',
        f'[0:a]volume=1.0[narr];[1:a]volume={bgm_volume}[bgm];'
        f'[narr][bgm]amix=inputs=2:duration=first[aout]',
        '-map', '0:v:0',
        '-map', '[aout]',
        '-c:v', 'copy',
        '-c:a', 'aac',
        output_path
    ])


# ---------------------------------------------------------------------------
# Etapa E — Inserir áudio em timestamps específicos
# ---------------------------------------------------------------------------

def add_timed_audio(
    video_path: str,
    audio_clips: list[dict],
    output_path: str,
    mix_volume: float = 1.0,
) -> None:
    """
    Insere clipes de áudio em timestamps específicos do vídeo.

    O áudio original do vídeo é preservado. Os clipes são mixados sobre ele
    nos instantes indicados. A duração do vídeo não é alterada.

    Args:
        video_path:   Caminho do vídeo de entrada (MP4).
        audio_clips:  Lista de dicts com:
                        - 'path' (str): caminho do arquivo de áudio
                        - 'start_sec' (float): timestamp de início em segundos
                        - 'volume' (float, opcional): volume do clip (padrão: 1.0)
        output_path:  Caminho do vídeo de saída (MP4).
        mix_volume:   Volume do áudio original do vídeo (padrão: 1.0).

    Exemplo:
        add_timed_audio(
            'video.mp4',
            [
                {'path': 'whoosh.mp3', 'start_sec': 2.0},
                {'path': 'sting.mp3',  'start_sec': 10.5, 'volume': 0.6},
            ],
            'out.mp4'
        )
    """
    if not audio_clips:
        shutil.copy(video_path, output_path)
        return

    inputs = ['-i', video_path]
    for clip in audio_clips:
        inputs += ['-i', clip['path']]

    filter_parts = [f'[0:a]volume={mix_volume}[orig]']

    for i, clip in enumerate(audio_clips):
        delay_ms = int(clip['start_sec'] * 1000)
        vol = clip.get('volume', 1.0)
        # adelay=Nms|Nms funciona para mono e stereo
        filter_parts.append(
            f'[{i + 1}:a]adelay={delay_ms}|{delay_ms},volume={vol}[sfx{i}]'
        )

    n_inputs = 1 + len(audio_clips)
    mix_inputs = '[orig]' + ''.join(f'[sfx{i}]' for i in range(len(audio_clips)))
    # duration=first: output termina quando o áudio original termina
    filter_parts.append(
        f'{mix_inputs}amix=inputs={n_inputs}:duration=first:dropout_transition=2[aout]'
    )

    filter_complex = ';'.join(filter_parts)

    run([
        'ffmpeg', '-y',
        *inputs,
        '-filter_complex', filter_complex,
        '-map', '0:v:0',
        '-map', '[aout]',
        '-c:v', 'copy',
        '-c:a', 'aac',
        output_path
    ])


# ---------------------------------------------------------------------------
# Pipeline principal
# ---------------------------------------------------------------------------

def edit_video(
    assets_dir: str,
    parts: list[str],
    no_subtitle: list[str],
    bgm_path: str,
    output_path: str,
    bgm_volume: float = 0.20,
    narration_texts: dict | None = None,
) -> dict:
    """
    Executa o pipeline completo de edição:
    A) Combinar áudio + vídeo por parte
    B) Adicionar legendas nas partes que precisam
    C) Concatenar todas as partes
    D) Mixar trilha sonora (com trim automático para duração exata do vídeo)

    Retorna dict com resultado.
    """
    assets = Path(assets_dir)
    tmp_dir = tempfile.mkdtemp(prefix='video_editor_')

    print(f"\n🎬  Iniciando edição — {len(parts)} partes | tmp: {tmp_dir}")
    print(f"    Partes sem legenda: {no_subtitle or ['nenhuma']}\n")

    ready_parts = []  # partes finais prontas para concatenação

    # -----------------------------------------------------------------------
    # Etapa A + B: processar cada parte individualmente
    # -----------------------------------------------------------------------
    for part in parts:
        video_src = str(assets / f"{part}.mp4")
        audio_src = str(assets / f"{part}.mp3")

        for fpath, label in [(video_src, 'vídeo'), (audio_src, 'narração')]:
            if not os.path.exists(fpath):
                raise FileNotFoundError(f"Arquivo de {label} não encontrado: {fpath}")

        with_audio = os.path.join(tmp_dir, f"{part}_with_audio.mp4")
        print(f"  🔊  [{part}] Combinando narração...")
        combine_audio_video(video_src, audio_src, with_audio)

        if part in no_subtitle:
            print(f"  ⏩  [{part}] Sem legenda (conforme especificado)")
            ready_parts.append(with_audio)
        else:
            if narration_texts and part in narration_texts:
                print(f"  📝  [{part}] Gerando SRT a partir do texto de narração...")
                srt_path = generate_srt_from_text(narration_texts[part], audio_src, tmp_dir)
            else:
                print(f"  📝  [{part}] Transcrevendo com Whisper...")
                srt_path = transcribe_audio(audio_src, tmp_dir)

            with_subs = os.path.join(tmp_dir, f"{part}_with_subs.mp4")
            print(f"  🔤  [{part}] Gravando legendas no vídeo...")
            burn_subtitles(with_audio, srt_path, with_subs)
            ready_parts.append(with_subs)

    # -----------------------------------------------------------------------
    # Etapa C: Concatenar todas as partes
    # -----------------------------------------------------------------------
    print(f"\n  🔗  Concatenando {len(ready_parts)} partes...")
    concat_out = os.path.join(tmp_dir, 'concat.mp4')
    concat_videos(ready_parts, concat_out)

    # -----------------------------------------------------------------------
    # Etapa D: Mixar trilha sonora de fundo
    # -----------------------------------------------------------------------
    if bgm_path:
        if not os.path.exists(bgm_path):
            raise FileNotFoundError(f"Arquivo de música de fundo não encontrado: {bgm_path}")
        print(f"  🎵  Mixando trilha sonora (volume {int(bgm_volume * 100)}%, duração exata do vídeo)...")
        mix_background_music(concat_out, bgm_path, output_path, bgm_volume)
    else:
        shutil.move(concat_out, output_path)

    # -----------------------------------------------------------------------
    # Resultado
    # -----------------------------------------------------------------------
    duration = get_duration(output_path)
    output_abs = str(Path(output_path).resolve())

    print(f"\n✅  Edição concluída!")
    print(f"    Arquivo: {output_abs}")
    print(f"    Duração: {duration:.1f}s\n")

    return {
        'success': True,
        'output_path': output_abs,
        'duration_seconds': round(duration, 2),
        'parts_processed': parts,
        'parts_with_subtitles': [p for p in parts if p not in no_subtitle],
        'parts_without_subtitles': no_subtitle,
        'timestamp': datetime.now().isoformat(),
    }


# ---------------------------------------------------------------------------
# CLI — subcomandos individuais
# ---------------------------------------------------------------------------

def _handle_error(e: Exception, use_json: bool) -> None:
    error = {'success': False, 'error': str(e)}
    if use_json:
        print(json.dumps(error, ensure_ascii=False))
    else:
        print(f"\n❌  {e}", file=sys.stderr)
    sys.exit(1)


def _cmd_burn_srt(argv: list[str]) -> None:
    p = argparse.ArgumentParser(
        prog='edit-video.py burn-srt',
        description='Grava legendas de um arquivo .srt no vídeo (sem Whisper).',
    )
    p.add_argument('--video', required=True, help='Vídeo de entrada (MP4)')
    p.add_argument('--srt', required=True, help='Arquivo de legendas (.srt)')
    p.add_argument('--output', required=True, help='Vídeo de saída (MP4)')
    p.add_argument('--json', action='store_true', dest='use_json')
    args = p.parse_args(argv)

    try:
        burn_subtitles(args.video, args.srt, args.output)
        result = _make_result(args.output)
        if args.use_json:
            print(json.dumps(result, ensure_ascii=False, indent=2))
    except Exception as e:
        _handle_error(e, args.use_json)


def _cmd_concat_transitions(argv: list[str]) -> None:
    p = argparse.ArgumentParser(
        prog='edit-video.py concat-transitions',
        description='Concatena vídeos com transição xfade entre os clips. Requer FFmpeg >= 4.3.',
    )
    p.add_argument('--videos', nargs='+', required=True, help='Lista de MP4s em ordem')
    p.add_argument('--output', required=True, help='Vídeo de saída (MP4)')
    p.add_argument('--transition', default='xfade',
                   help='Tipo de transição: xfade, fade, wipeleft, wiperight, slideleft, slideright (padrão: xfade)')
    p.add_argument('--duration', type=float, default=0.5,
                   help='Duração da transição em segundos (padrão: 0.5)')
    p.add_argument('--json', action='store_true', dest='use_json')
    args = p.parse_args(argv)

    try:
        concat_videos_with_transitions(args.videos, args.output, args.transition, args.duration)
        result = _make_result(args.output, {'clips': len(args.videos), 'transition': args.transition})
        if args.use_json:
            print(json.dumps(result, ensure_ascii=False, indent=2))
    except Exception as e:
        _handle_error(e, args.use_json)


def _cmd_add_timed_audio(argv: list[str]) -> None:
    p = argparse.ArgumentParser(
        prog='edit-video.py add-timed-audio',
        description='Insere clipes de áudio em timestamps específicos do vídeo.',
    )
    p.add_argument('--video', required=True, help='Vídeo de entrada (MP4)')
    p.add_argument('--clips', required=True,
                   help='JSON array: [{"path":"sfx.mp3","start_sec":5.0,"volume":1.0}, ...]')
    p.add_argument('--output', required=True, help='Vídeo de saída (MP4)')
    p.add_argument('--mix-volume', type=float, default=1.0, dest='mix_volume',
                   help='Volume do áudio original do vídeo (padrão: 1.0)')
    p.add_argument('--json', action='store_true', dest='use_json')
    args = p.parse_args(argv)

    try:
        audio_clips = json.loads(args.clips)
        if not isinstance(audio_clips, list):
            raise ValueError("--clips deve ser um JSON array")
        add_timed_audio(args.video, audio_clips, args.output, args.mix_volume)
        result = _make_result(args.output, {'clips_inserted': len(audio_clips)})
        if args.use_json:
            print(json.dumps(result, ensure_ascii=False, indent=2))
    except Exception as e:
        _handle_error(e, args.use_json)


def _cmd_mix_bgm(argv: list[str]) -> None:
    p = argparse.ArgumentParser(
        prog='edit-video.py mix-bgm',
        description='Corta a BGM para a duração exata do vídeo e mixa com o áudio existente.',
    )
    p.add_argument('--video', required=True, help='Vídeo de entrada (MP4)')
    p.add_argument('--bgm', required=True, help='Música de fundo (MP3/M4A)')
    p.add_argument('--output', required=True, help='Vídeo de saída (MP4)')
    p.add_argument('--bgm-volume', type=float, default=0.20, dest='bgm_volume',
                   help='Volume da BGM (0.0–1.0, padrão: 0.20)')
    p.add_argument('--json', action='store_true', dest='use_json')
    args = p.parse_args(argv)

    try:
        mix_background_music(args.video, args.bgm, args.output, args.bgm_volume)
        result = _make_result(args.output, {'bgm_volume': args.bgm_volume})
        if args.use_json:
            print(json.dumps(result, ensure_ascii=False, indent=2))
    except Exception as e:
        _handle_error(e, args.use_json)


# ---------------------------------------------------------------------------
# CLI — pipeline legado (modo padrão, backward-compatible)
# ---------------------------------------------------------------------------

def _main_legacy() -> None:
    parser = argparse.ArgumentParser(
        description='Edita e monta vídeo TikTok a partir de cenas + narrações.'
    )
    parser.add_argument('--assets-dir', required=True,
                        help='Pasta com os arquivos parteN.mp4 e parteN.mp3')
    parser.add_argument('--parts', nargs='+', default=['parte1', 'parte2', 'parte3', 'parte4'],
                        help='Lista de partes na ordem de montagem')
    parser.add_argument('--no-subtitle', nargs='*', default=[], dest='no_subtitle',
                        help='Partes que NÃO devem receber legenda')
    parser.add_argument('--bgm', default=None, help='Caminho para a música de fundo (MP3)')
    parser.add_argument('--bgm-volume', type=float, default=0.20,
                        help='Volume da música de fundo (0.0–1.0, padrão: 0.20)')
    parser.add_argument('--output', required=True, help='Caminho do vídeo final de saída (MP4)')
    parser.add_argument('--narration-texts', default=None, dest='narration_texts',
                        help='JSON mapeando parte → texto de narração para geração de SRT sem Whisper. '
                             'Ex: \'{"parte1": "texto...", "parte2": "texto..."}\'')
    parser.add_argument('--json', action='store_true',
                        help='Imprimir resultado em JSON (para uso programático)')

    args = parser.parse_args()

    narration_texts = None
    if args.narration_texts:
        try:
            narration_texts = json.loads(args.narration_texts)
            if not isinstance(narration_texts, dict):
                raise ValueError("--narration-texts deve ser um JSON object")
        except (json.JSONDecodeError, ValueError) as e:
            print(f"❌  --narration-texts inválido: {e}", file=sys.stderr)
            sys.exit(1)

    try:
        result = edit_video(
            assets_dir=args.assets_dir,
            parts=args.parts,
            no_subtitle=args.no_subtitle,
            bgm_path=args.bgm,
            output_path=args.output,
            bgm_volume=args.bgm_volume,
            narration_texts=narration_texts,
        )
        if args.json:
            print(json.dumps(result, ensure_ascii=False, indent=2))
    except FileNotFoundError as e:
        _handle_error(e, args.json)
    except Exception as e:
        _handle_error(e, args.json)


def main() -> None:
    # Roteia para subcomando se o primeiro argumento for um subcomando conhecido;
    # caso contrário, usa o parser legado para preservar backward compatibility.
    if len(sys.argv) >= 2 and sys.argv[1] in _SUBCOMMANDS:
        subcommand = sys.argv[1]
        rest = sys.argv[2:]
        dispatch = {
            'burn-srt':            _cmd_burn_srt,
            'concat-transitions':  _cmd_concat_transitions,
            'add-timed-audio':     _cmd_add_timed_audio,
            'mix-bgm':             _cmd_mix_bgm,
        }
        dispatch[subcommand](rest)
    else:
        _main_legacy()


if __name__ == '__main__':
    main()
