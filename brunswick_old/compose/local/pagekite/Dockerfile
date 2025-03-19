FROM python:2.7-alpine
MAINTAINER Thomas Zhang <zhgqthomas@gmail.com>

# Install pagekite
ENV PAGE_KITE_BINARY /usr/bin/pagekite.py
ADD https://pagekite.net/pk/pagekite.py $PAGE_KITE_BINARY

RUN apk upgrade --update-cache --available && \
    apk add openssl && \
    rm -rf /var/cache/apk/*

ENTRYPOINT ["python", "/usr/bin/pagekite.py"]