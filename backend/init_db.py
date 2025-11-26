from app import app
from models import db, User
from werkzeug.security import generate_password_hash

def init_database():
    with app.app_context():
        db.create_all()
        
        admin = User.query.filter_by(email='admin@gmail.com').first()
        if not admin:
            admin = User(
                name='Administrador',
                email='admin@gmail.com',
                password=generate_password_hash('123')
            )
            db.session.add(admin)
            db.session.commit()
            print('✅ Usuário admin criado: admin@gmail.com / 123')
        else:
            print('ℹ️  Usuário admin já existe')
        
        print('✅ Database inicializada com sucesso!')

if __name__ == '__main__':
    init_database()
