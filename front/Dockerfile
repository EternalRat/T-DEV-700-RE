FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update -y && \
    apt upgrade -y && \
    apt -y install curl openjdk-17-jdk openjdk-17-jre android-sdk dos2unix git

ENV ANDROID_HOME /usr/lib/android-sdk/
ENV PATH PATH ${ANDROID_HOME}/tools:$ANDROID_HOME/platform-tools:$PATH

RUN echo 8933bad161af4178b1185d1a37fbf41ea5269c55 > $ANDROID_HOME/licenses/android-sdk-license && \
    echo d56f5187479451eabf01fb78af6dfcb131a6481e >> $ANDROID_HOME/licenses/android-sdk-license && \
    echo 24333f8a63b6825ea9c5514f83c2829b004d1fee >> $ANDROID_HOME/licenses/android-sdk-license && \
    echo 84831b9409646a918e30573bab4c9c91346d8abd > $ANDROID_HOME/licenses/android-sdk-preview-license

RUN curl -sL https://deb.nodesource.com/setup_20.x -o /tmp/nodesource_setup.sh

RUN bash /tmp/nodesource_setup.sh

RUN apt -y install nodejs chromium-browser

WORKDIR /app

RUN npm install -g yarn

RUN yarn global add react-native-cli

COPY package.json ./

RUN yarn install

COPY . .

WORKDIR /app/android

RUN chmod +x gradlew

RUN dos2unix ./gradlew && apt-get --purge remove -y dos2unix && rm -rf /var/lib/apt/lists/*

RUN ./gradlew assembleRelease

WORKDIR /app

RUN mkdir -p ./build-apk/

RUN mv ./android/app/build/outputs/apk/release/app-release.apk ./build-apk/client.apk