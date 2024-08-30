waitTilTrue(() => isNotEmpty(user))
.then(() => {
  document.body.style.backgroundImage = `url('/static/users/banners/${user.id}.gif')`
});