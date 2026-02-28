"""
Streamlit testing interface for ShikaarAI — Cab Service Explanation Chatbot.

This app directly calls the RAG pipeline (no HTTP) for fast local
testing. It provides a chat interface, pagination controls, and an
optional debug view showing retrieved context chunks.

Run:
    streamlit run streamlit_app.py
"""

import streamlit as st
from dotenv import load_dotenv

# Load .env before any app code imports settings
load_dotenv()

from app.rag.chain import rag_pipeline  # noqa: E402


# ─────────────────────────────────────────────────────────────────────────
# Page config
# ─────────────────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="ShikaarAI — Cab Service Assistant",
    page_icon="🚕",
    layout="wide",
)

# ─────────────────────────────────────────────────────────────────────────
# Custom CSS
# ─────────────────────────────────────────────────────────────────────────
st.markdown(
    """
    <style>
    .main-header {
        text-align: center;
        padding: 1rem 0;
    }
    .main-header h1 {
        background: linear-gradient(135deg, #667eea, #764ba2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 2.4rem;
        font-weight: 800;
    }
    .main-header p {
        color: #6b7280;
        font-size: 1.05rem;
    }
    .stChatMessage { border-radius: 12px; }
    </style>
    """,
    unsafe_allow_html=True,
)

# ─────────────────────────────────────────────────────────────────────────
# Header
# ─────────────────────────────────────────────────────────────────────────
st.markdown(
    """
    <div class="main-header">
        <h1>🚕 ShikaarAI</h1>
        <p>Cab Service Workflow Explanation Assistant</p>
    </div>
    """,
    unsafe_allow_html=True,
)

# ─────────────────────────────────────────────────────────────────────────
# Sidebar — Pagination controls
# ─────────────────────────────────────────────────────────────────────────
with st.sidebar:
    st.header("⚙️ Settings")

    page_number = st.number_input(
        "Context Page Number",
        min_value=1,
        value=1,
        step=1,
        help="Which page of retrieved context to send to the AI.",
    )

    page_size = st.slider(
        "Chunks per Page",
        min_value=1,
        max_value=10,
        value=3,
        help="Number of knowledge chunks per page.",
    )

    show_debug = st.checkbox(
        "🔍 Show Retrieved Context",
        value=False,
        help="Display the raw knowledge chunks used to generate the answer.",
    )

    st.divider()
    st.caption(
        "This assistant **only explains** cab service workflows. "
        "It cannot book rides, cancel trips, or access accounts."
    )

# ─────────────────────────────────────────────────────────────────────────
# Chat history (session state)
# ─────────────────────────────────────────────────────────────────────────
if "messages" not in st.session_state:
    st.session_state.messages = [
        {
            "role": "assistant",
            "content": (
                "👋 Hello! I'm **ShikaarAI**, your cab service workflow "
                "explanation assistant.\n\n"
                "Ask me anything about:\n"
                "- 🚗 Ride booking stages\n"
                "- 🧑‍✈️ Driver assignment logic\n"
                "- ❌ Cancellation policies\n"
                "- 🛡️ Safety features\n"
                "- 💰 Fare estimation & pricing"
            ),
        }
    ]

# Display chat history
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

# ─────────────────────────────────────────────────────────────────────────
# User input
# ─────────────────────────────────────────────────────────────────────────
user_query = st.chat_input("Ask about cab service workflows…")

if user_query:
    # Show user message
    st.session_state.messages.append({"role": "user", "content": user_query})
    with st.chat_message("user"):
        st.markdown(user_query)

    # Generate response
    with st.chat_message("assistant"):
        with st.spinner("Thinking…"):
            try:
                result = rag_pipeline(
                    query=user_query,
                    page=page_number,
                    page_size=page_size,
                )
                answer = result.answer
                st.markdown(answer)

                # Pagination info
                st.caption(
                    f"📄 Context page **{result.page}** of **{result.total_pages}**"
                )

                # Debug context view
                if show_debug and result.context_chunks:
                    with st.expander("🔍 Retrieved Context Chunks", expanded=False):
                        for i, chunk in enumerate(result.context_chunks, 1):
                            st.markdown(f"**Chunk {i}:**")
                            st.code(chunk, language=None)

            except Exception as e:
                answer = f"⚠️ Error: {e}"
                st.error(answer)

    st.session_state.messages.append({"role": "assistant", "content": answer})
