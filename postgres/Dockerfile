FROM postgres:15-alpine

RUN apk add --no-cache --virtual .build-deps \
    git \
    postgresql-dev \
    gcc \
    make \
    musl-dev \
    clang \
    llvm

RUN git clone --branch v0.5.1 https://github.com/pgvector/pgvector.git \
    && cd pgvector \
    && make OPTFLAGS="" \
    && make install \
    && cd .. \
    && rm -rf pgvector

RUN apk del .build-deps