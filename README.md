# Cash Manager
# Context

We had to create a mobile application solution that would allow us to pay for different content.
We chose to be a company, so we needed only one TPE for now at least.
Because of that, right now there is no way to add a new TPE.

Since it's in a company, there's no reason to have a queue system on the TPE so only one person can pay at the same time.

# How to launch

## Android

### Requirements

- Two devices, one needs to have the NFC module enabled
- Ngrok

### How to

In order to use the application locally, you will need to install NGROK from there based on your OS : https://ngrok.com/download.
You will also need to create an account to get your NGROK_AUTHTOKEN. Once you have your account and your token, do the following : `ngrok config add-authtoken <token>`. 

Create a .env on the root with the following content :
```
DATABASE_URL=mysql://<user>:<password>@<host>:3306/<dbname>
DB_USER=<user>
DB_HOST=<host>
DB_PASS=<password>
DB_NAME=<dbname>
PORT=<port>
```
Make sure to replace the content with your desired content and make sure to adapt everything after.

Once that is done, you will need to build the back with the command `docker compose up -d --build back cashbackdb`.
Once the back is built, run the following command locally `ngrok http <port>`.

When ngrok is running, create a .env in both tpe and front folder with the following content :
`API_URL=<ngrok_ip>`. Your ngrok ip will be display on the ngrok cli on the "Forwarding" line.

Then run the command `docker compose up -d --build front tpe` or front then tpe and wait something like probably 10minutes.

Once everything docker has finished, you can download the apk from the following url :
`http://{local_ip}:8080/{client/tpe}.apk.