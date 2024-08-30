from flask import Flask, render_template, url_for, redirect, request, jsonify
#type: ignore


class Routes:

  def __init__(self, app, db, message_db, user_db):
    self.app = app
    self.db = db
    self.message_db = message_db
    self.user_db = user_db

  def init_routes(self):

    @self.app.route('/')
    def authorize():
      return render_template("authorize.html")

    @self.app.route('/community')
    def community():
      messages = self.message_db.query.order_by(
          self.message_db.message_id.desc()).limit(10).all()
      return render_template("community.html", messages=reversed(messages))

    @self.app.route('/author')
    def author():
      return render_template("author.html")

    @self.app.route('/me')
    def me():
      return render_template("user.html")

    @self.app.route('/me/setbanner/<int:id>', methods=['POST'])
    def setbanner(id):
      user_ = self.user_db.query.get(id)
      if user_ is not None:
        user_.user_description = request.form['about']
        try:
          self.db.session.commit()
        except Exception as e:
          print(e)

        if 'file' not in request.files or request.files['file'].filename == '':
          return redirect("/me")
        file = request.files['file']
        file_type = file.filename.split('.')[-1]
        if file_type not in ['png', 'jpg', 'jpeg', 'gif']:
          return redirect("/me")
        file.save(f"static/users/banners/{id}.gif")

      return redirect("/me")

    @self.app.route('/users')
    def users():
      users = self.user_db.query.order_by(self.user_db.user_nick).all()
      return render_template("users.html", users=users)

    @self.app.route('/user/<int:id>')
    def user(id):
      user_ = self.user_db.query.get(id)
      if user_ is None:
        return "Something went wrong"
      else:
        return render_template("check_user.html", user=user_)

    @self.app.route('/entertainment')
    def entertainment():
      return render_template("entertainment.html")

    @self.app.route('/extra')
    def extra():
      return render_template("extra.html")

    @self.app.route('/api/user', methods=['GET'])
    def get_user_():

      print(request.headers)
      id = request.headers["Authorization"]

      user_ = self.user_db.query.get(int(id))
      if user_ is not None:
        user_data = {
            "id": f"{user_.user_id}",
            "nick": user_.user_nick,
            "name": user_.user_name,
            "email": user_.user_email,
            "about": user_.user_description,
            "icon": user_.user_icon
        }
      else:
        user_data = {}

      return jsonify(user_data)
