FROM node:20.12.2

RUN apt update -y && \
    apt upgrade -y && \
    apt -y install curl openjdk-17-jdk openjdk-17-jre android-sdk chromium

ENV ANDROID_HOME /usr/lib/android-sdk/
ENV PATH PATH ${ANDROID_HOME}/tools:$ANDROID_HOME/platform-tools:$PATH

RUN echo 8933bad161af4178b1185d1a37fbf41ea5269c55 > $ANDROID_HOME/licenses/android-sdk-license && \
    echo d56f5187479451eabf01fb78af6dfcb131a6481e >> $ANDROID_HOME/licenses/android-sdk-license && \
    echo 24333f8a63b6825ea9c5514f83c2829b004d1fee >> $ANDROID_HOME/licenses/android-sdk-license && \
    echo 84831b9409646a918e30573bab4c9c91346d8abd > $ANDROID_HOME/licenses/android-sdk-preview-license

WORKDIR /app

RUN yarn global add react-native-cli

COPY package.json ./

RUN yarn install

COPY . .

RUN react-native eject

COPY backup_app/ /app/android/app/

WORKDIR /app/android

RUN chmod +x gradlew

RUN sh gradlew assembleRelease

WORKDIR /app

RUN mkdir -p ./build-apk/

RUN mv ./android/app/build/outputs/apk/release/app-release.apk ./build-apk/client.apk

ENTRYPOINT ["tail", "-f", "/dev/null"]