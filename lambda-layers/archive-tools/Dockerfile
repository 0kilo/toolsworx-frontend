FROM public.ecr.aws/lambda/provided:al2

# Install archive tools
RUN yum update -y && \
    yum install -y \
    unzip \
    zip \
    tar \
    bzip2 \
    p7zip \
    p7zip-plugins && \
    yum clean all

# Install unrar (from EPEL)
RUN yum install -y epel-release && \
    yum install -y unrar && \
    yum clean all

# Create layer structure
RUN mkdir -p /opt/bin
RUN cp /usr/bin/zip /opt/bin/
RUN cp /usr/bin/unzip /opt/bin/
RUN cp /usr/bin/tar /opt/bin/
RUN cp /usr/bin/bzip2 /opt/bin/
RUN cp /usr/bin/7z /opt/bin/
RUN cp /usr/bin/unrar /opt/bin/

# Package layer
RUN cd /opt && zip -r /tmp/archive-tools-layer.zip .

CMD ["echo", "Archive tools layer built"]