from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
import os
from functools import wraps
from models import db, User, Orcamento

app = Flask(__name__, static_folder='static')
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://user:password@db:5432/cruddb')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
CORS(app)

# Decorator para validar token
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token não fornecido'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token.split(' ')[1]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
            if not current_user:
                return jsonify({'message': 'Usuário não encontrado'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token inválido'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

# Rotas de autenticação
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('name') or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Dados incompletos'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email já cadastrado'}), 400
    
    hashed_password = generate_password_hash(data['password'])
    new_user = User(
        name=data['name'],
        email=data['email'],
        password=hashed_password
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'Usuário cadastrado com sucesso', 'user': new_user.to_dict()}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Dados incompletos'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Email ou senha incorretos'}), 401
    
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, app.config['SECRET_KEY'], algorithm='HS256')
    
    return jsonify({
        'message': 'Login realizado com sucesso',
        'token': token,
        'user': user.to_dict()
    }), 200

# CRUD de usuários
@app.route('/api/users', methods=['GET'])
@token_required
def get_users(current_user):
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200

@app.route('/api/users/<int:user_id>', methods=['GET'])
@token_required
def get_user(current_user, user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'Usuário não encontrado'}), 404
    return jsonify(user.to_dict()), 200

@app.route('/api/users/<int:user_id>', methods=['PUT'])
@token_required
def update_user(current_user, user_id):
    if current_user.id != user_id:
        return jsonify({'message': 'Não autorizado'}), 403
    
    data = request.get_json()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'message': 'Usuário não encontrado'}), 404
    
    if data.get('name'):
        user.name = data['name']
    if data.get('email'):
        existing = User.query.filter_by(email=data['email']).first()
        if existing and existing.id != user_id:
            return jsonify({'message': 'Email já cadastrado'}), 400
        user.email = data['email']
    if data.get('password'):
        user.password = generate_password_hash(data['password'])
    
    db.session.commit()
    return jsonify({'message': 'Usuário atualizado', 'user': user.to_dict()}), 200

@app.route('/api/users/<int:user_id>', methods=['DELETE'])
@token_required
def delete_user(current_user, user_id):
    if current_user.id != user_id:
        return jsonify({'message': 'Não autorizado'}), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'Usuário não encontrado'}), 404
    
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'Usuário deletado'}), 200

# CRUD de orçamentos
@app.route('/api/orcamentos', methods=['POST'])
@token_required
def create_orcamento(current_user):
    data = request.get_json()
    
    if not data or not all(k in data for k in ['peca', 'altura', 'largura', 'area', 'total']):
        return jsonify({'message': 'Dados incompletos'}), 400
    
    orcamento = Orcamento(
        user_id=current_user.id,
        peca=data['peca'],
        altura=data['altura'],
        largura=data['largura'],
        area=data['area'],
        total=data['total']
    )
    
    db.session.add(orcamento)
    db.session.commit()
    
    return jsonify({'message': 'Orçamento criado', 'orcamento': orcamento.to_dict()}), 201

@app.route('/api/orcamentos', methods=['GET'])
@token_required
def get_orcamentos(current_user):
    orcamentos = Orcamento.query.filter_by(user_id=current_user.id).order_by(Orcamento.created_at.desc()).all()
    return jsonify([orc.to_dict() for orc in orcamentos]), 200

@app.route('/api/orcamentos/<int:orc_id>', methods=['DELETE'])
@token_required
def delete_orcamento(current_user, orc_id):
    orcamento = Orcamento.query.get(orc_id)
    if not orcamento:
        return jsonify({'message': 'Orçamento não encontrado'}), 404
    
    if orcamento.user_id != current_user.id:
        return jsonify({'message': 'Não autorizado'}), 403
    
    db.session.delete(orcamento)
    db.session.commit()
    return jsonify({'message': 'Orçamento deletado'}), 200

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200

# Rotas para servir o frontend
@app.route('/')
def index():
    return send_from_directory('static/login', 'index.html')

@app.route('/login/')
@app.route('/login/<path:filename>')
def login_page(filename='index.html'):
    return send_from_directory('static/login', filename)

@app.route('/home/')
@app.route('/home/<path:filename>')
def home_page(filename='index.html'):
    return send_from_directory('static/home', filename)

@app.route('/historico/')
@app.route('/historico/<path:filename>')
def historico_page(filename='index.html'):
    return send_from_directory('static/historico', filename)

@app.route('/Imagens/<path:filename>')
def imagens(filename):
    return send_from_directory('static/Imagens', filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
