from flask_sqlalchemy import SQLAlchemy
import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'created_at': self.created_at.isoformat()
        }

class Orcamento(db.Model):
    __tablename__ = 'orcamentos'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    peca = db.Column(db.String(100), nullable=False)
    altura = db.Column(db.Float, nullable=False)
    largura = db.Column(db.Float, nullable=False)
    area = db.Column(db.Float, nullable=False)
    total = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    user = db.relationship('User', backref='orcamentos')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'peca': self.peca,
            'altura': self.altura,
            'largura': self.largura,
            'area': self.area,
            'total': self.total,
            'data': self.created_at.strftime('%d/%m/%Y %H:%M')
        }
