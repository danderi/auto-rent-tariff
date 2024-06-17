# En el conjunto de datos que quiero separar ( en este caso este tipo de rutas ), importo...
from flask import Blueprint, request, jsonify # Blueprint para modularizar y relacionar con app
from flask_bcrypt import Bcrypt                                  # Bcrypt para encriptación
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity   # Jwt para tokens
from models import User                                          # importar tabla "User" de models
from database import db                                          # importa la db desde database.py
from datetime import timedelta                                   # importa tiempo especifico para rendimiento de token válido


admin_bp = Blueprint('admin', __name__)     # instanciar admin_bp desde clase Blueprint para crear las rutas.

bcrypt = Bcrypt()
jwt = JWTManager()

# RUTA TEST de http://127.0.0.1:5000/admin_bp que muestra "Hola mundo":
@admin_bp.route('/', methods=['GET'])
def show_hello_world():
     return "Hola mundo",200


# RUTA CREAR USUARIO
@admin_bp.route('/users', methods=['POST'])
def create_user():
    try:
        email = request.json.get('email')
        password = request.json.get('password')
        name = request.json.get('firstName')
        last_name = request.json.get('lastName')

        if not email or not password or not name:
            return jsonify({'error': 'Email, password and Name are required.'}), 400

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'error': 'Email already exists.'}), 409

        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')


        # Ensamblamos el usuario nuevo
        new_user = User(email=email, password=password_hash, name=name, last_name=last_name)


        db.session.add(new_user)
        db.session.commit()

        good_to_share_user = {
            'id': new_user.id,
            'name':new_user.name,
            'last_name': new_user.last_name,
            'email':new_user.email,
            'password':password
        }

        return jsonify({'message': 'User created successfully.','user_created':good_to_share_user}), 201

    except Exception as e:
        return jsonify({'error': 'Error in user creation: ' + str(e)}), 500


#RUTA LOG-IN ( CON TOKEN DE RESPUESTA )
@admin_bp.route('/token', methods=['POST'])
def get_token():
    try:
        email = request.json.get('email')
        password = request.json.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password are required.'}), 400

        login_user = User.query.filter_by(email=email).first()
        if not login_user:
            return jsonify({'error': 'User not found.'}), 404

        if not bcrypt.check_password_hash(login_user.password, password):
            return jsonify({'error': 'Invalid password.'}), 401

        expires = timedelta(minutes=30)
        access_token = create_access_token(identity=login_user.id, expires_delta=expires)
        return jsonify({ 'access_token': access_token }), 200

    except Exception as e:
        return jsonify({'error': 'Error during login: ' + str(e)}), 500

    
# EJEMPLO DE RUTA RESTRINGIDA POR TOKEN. ( LA MISMA RECUPERA TODOS LOS USERS Y LO ENVIA PARA QUIEN ESTÉ LOGUEADO )
    
@admin_bp.route('/users')
@jwt_required()  # Decorador para requerir autenticación con JWT
def show_users():
    current_user_id = get_jwt_identity()  # Obtiene la id del usuario del token
    if current_user_id:
        users = User.query.all()
        user_list = []
        for user in users:
            user_dict = {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'last_name': user.last_name
            }
            user_list.append(user_dict)
            print('User list:', user_list)
        return jsonify(user_list), 200
    else:
        return {"Error": "Token inválido o no proporcionado"}, 401
