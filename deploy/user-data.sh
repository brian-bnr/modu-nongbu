#!/bin/bash
set -ex
exec > /var/log/mdfarm-bootstrap.log 2>&1

# Node.js 20 via NodeSource
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
dnf install -y nodejs git

# AWS CLI (Amazon Linux 2023 usually ships it, but ensure it's present)
if ! command -v aws >/dev/null 2>&1; then
  curl -fsSL "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o /tmp/awscliv2.zip
  cd /tmp && unzip -q awscliv2.zip && ./aws/install
fi

mkdir -p /opt/modu-nongbu
git config --system --add safe.directory /opt/modu-nongbu
git clone https://github.com/brian-bnr/modu-nongbu.git /opt/modu-nongbu
chown -R ec2-user:ec2-user /opt/modu-nongbu

cp /opt/modu-nongbu/deploy/modu-nongbu.service /etc/systemd/system/modu-nongbu.service
systemctl daemon-reload
systemctl enable modu-nongbu

# allow ec2-user to restart the service without a password (deploy.sh runs `sudo systemctl restart`)
echo "ec2-user ALL=(root) NOPASSWD: /usr/bin/systemctl restart modu-nongbu, /usr/bin/systemctl status modu-nongbu" > /etc/sudoers.d/mdfarm-deploy
chmod 440 /etc/sudoers.d/mdfarm-deploy

# initial deploy (build + start)
sudo -u ec2-user -i bash -c "cd /opt/modu-nongbu && bash deploy/deploy.sh"
