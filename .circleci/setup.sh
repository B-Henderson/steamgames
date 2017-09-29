 #!/bin/bash
  git remote add heroku https://git.heroku.com/steam-random.git
  wget https://cli-assets.heroku.com/branches/stable/heroku-linux-amd64.tar.gz
  sudo mkdir -p /usr/local/lib /usr/local/bin
  sudo tar -xvzf heroku-linux-amd64.tar.gz -C /usr/local/lib
  sudo ln -s /usr/local/lib/heroku/bin/heroku /usr/local/bin/heroku
     
 cat << EOF >> ~/.netrc
  machine api.heroku.com
    login ${herokuName}
    password ${heroku_ap}
  machine git.heroku.com
    login ${herokuName}
    password ${heroku_ap}
  EOF

  # Add heroku.com to the list of known hosts
  ssh-keyscan -H heroku.com >> ~/.ssh/known_hosts