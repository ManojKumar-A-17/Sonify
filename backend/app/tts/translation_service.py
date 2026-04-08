from deep_translator import GoogleTranslator


SUPPORTED_TRANSLATION_LANGUAGES = {
    "auto": "auto",
    "en": "english",
    "es": "spanish",
    "fr": "french",
    "de": "german",
    "it": "italian",
    "pt": "portuguese",
}


def translate_text(text: str, source_lang: str, target_lang: str) -> tuple[str, str]:
    """
    Translate text into the target language.

    Returns:
        Tuple of (translated_text, resolved_source_language)
    """
    resolved_source = SUPPORTED_TRANSLATION_LANGUAGES[source_lang]
    resolved_target = SUPPORTED_TRANSLATION_LANGUAGES[target_lang]

    if source_lang != "auto" and source_lang == target_lang:
        return text, source_lang

    translator = GoogleTranslator(source=resolved_source, target=resolved_target)
    translated = translator.translate(text)
    detected_source = source_lang if source_lang != "auto" else "auto"
    return translated, detected_source
