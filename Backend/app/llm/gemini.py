"""
Google Gemini LLM integration module.

Provides a singleton Gemini model instance and a function to generate
answers from prompt strings. Configuration is driven by environment
variables via the Settings object.
"""

import logging
from typing import Optional

import google.generativeai as genai
from google.generativeai import GenerativeModel

from app.core.config import get_settings

logger = logging.getLogger(__name__)

# ── Singleton model instance ────────────────────────────────────────────
_model: Optional[GenerativeModel] = None


def _get_model() -> GenerativeModel:
    """Return a lazily-initialised singleton GenerativeModel."""
    global _model
    if _model is None:
        settings = get_settings()
        if not settings.GEMINI_API_KEY:
            raise ValueError(
                "GEMINI_API_KEY is not set. Please add it to your .env file."
            )
        genai.configure(api_key=settings.GEMINI_API_KEY)
        _model = genai.GenerativeModel(
            settings.GEMINI_MODEL,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                temperature=0.7,
                max_output_tokens=1024,
            ),
        )
        logger.info(
            "Gemini model '%s' initialised with JSON mode.", settings.GEMINI_MODEL
        )
    return _model


def generate_answer(prompt: str) -> str:
    """Send *prompt* to Gemini and return the generated text.

    Args:
        prompt: The full prompt string including system instructions,
                context, and the user question.

    Returns:
        The model's text response.

    Raises:
        RuntimeError: If the API call fails.
    """
    try:
        model = _get_model()
        response = model.generate_content(prompt)
        logger.debug("Gemini response received (%d chars).", len(response.text))
        return response.text
    except Exception as exc:
        logger.error("Gemini API call failed: %s", exc)
        raise RuntimeError(f"Failed to generate answer: {exc}") from exc
