from flask import Flask, render_template, url_for, redirect, request, jsonify
from flask_socketio import SocketIO, emit
from flask_sqlalchemy import SQLAlchemy
from PIL import Image

from routes import Routes

#type: ignore

app = Flask("Amistix")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
socketio = SocketIO(app)

db = SQLAlchemy(app)


class User(db.Model):
  __tablename__ = 'user'
  user_id = db.Column(db.Integer, primary_key=True)
  user_nick = db.Column(db.String(50))
  user_name = db.Column(db.String(50))
  user_email = db.Column(db.String(100))
  user_icon = db.Column(db.String(500))
  user_description = db.Column(db.Text)

class Message(db.Model):
  __tablename__ = 'message'
  message_id = db.Column(db.Integer, primary_key=True)
  message_author_id = db.Column(db.Integer)
  message_text = db.Column(db.Text)

routes = Routes(app, db, Message, User)
routes.init_routes()

@socketio.on('update_profile')
def handle_message(data):
  user_ = User.query.get(int(data['id']))
  if user_ is None:
    user = User()

    user.user_id = int(data['id'])
    user.user_nick = data['global_name']
    user.user_name = data['username']
    user.user_email = data['email']
    user.user_description = ''

    if data['avatar'] is not None:
      user.user_icon = f"https://cdn.discordapp.com/avatars/{data['id']}/${data['avatar']}.jpg?size=4096"
    else:
      user.user_icon = "https://cdn.discordapp.com/embed/avatars/0.png?size=4096"

    img = Image.new(mode="RGB", size=(1, 1), color=(63, 63, 63))
    img.save(f'static/users/banners/{data["id"]}.gif')

    db.session.add(user)
  else:
    user_.user_nick = data['global_name']
    user_.user_name = data['username']
    user_.user_email = data['email']
    if data['avatar'] is not None:
      user_.user_icon = f"https://cdn.discordapp.com/avatars/{data['id']}/{data['avatar']}.jpg?size=4096"
    else:
      user_.user_icon = "https://cdn.discordapp.com/embed/avatars/0.png?size=4096"
  try:
    db.session.commit()
  except Exception as e:
    print(e)

@socketio.on('message')
def _message(data):
  message = Message()

  message.message_text = data['mess']
  message.message_author_id = int(data['user_obj']['id'])

  db.session.add(message)
  try:
    db.session.commit()
  except Exception as e:
    print(e)

  emit("message_to_add", data, broadcast=True)


#Running
with app.app_context():
  db.create_all()
  socketio.run(
    app          = app,
    debug        = True,
    host         = "0.0.0.0",
    port         = 8080,
    use_reloader = True,
    log_output   = True
  )