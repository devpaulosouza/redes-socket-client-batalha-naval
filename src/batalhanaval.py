from flask import (
    Blueprint, render_template
)

bp = Blueprint('batalhanaval', __name__)


@bp.route('/')
def index():
    """Página de inicio do jogo."""
    return render_template('batalha-naval/index.html')