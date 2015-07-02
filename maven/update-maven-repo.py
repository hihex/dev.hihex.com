#!/usr/bin/env python3

import argparse
import datetime
import hashlib
import pathlib
import xml.etree.ElementTree
import zipfile

def create_arg_parser():
    parser = argparse.ArgumentParser(description='Add a new SDK to this Maven repository.')
    parser.add_argument('-v', '--version', help='SDK version (e.g. 1.6.2)', required=True)
    parser.add_argument('-i', '--input', help='Path to the SDK zip file', required=True)
    return parser


def update_maven_metadata(version):
    metadata_path = 'hihex/sbrc/sbrc/maven-metadata.xml'
    x = xml.etree.ElementTree.parse(metadata_path)

    last_updated_tag = x.find('versioning/lastUpdated')
    now = datetime.datetime.now(tz=datetime.timezone.utc)
    last_updated_tag.text = now.strftime('%Y%m%d%H%M%S')

    tags = [x.find('version'), x.find('versioning/latest'), x.find('versioning/release')]
    for tag in tags:
        tag.text = version

    versions_tag = x.find('versioning/versions')
    for tag in versions_tag.iterfind('version'):
        if tag.text == version:
            break
    else:
        new_version_tag = xml.etree.ElementTree.Element('version')
        new_version_tag.text = version
        versions_tag.append(new_version_tag)

    x.write(metadata_path, encoding='UTF-8', xml_declaration=True)



def write_checksum(path):
    md5 = hashlib.md5()
    sha1 = hashlib.sha1()
    block_size = 16384

    with path.open('rb') as f:
        while True:
            block = f.read(block_size)
            if not block:
                break
            md5.update(block)
            sha1.update(block)

    with path.with_suffix(path.suffix + '.md5').open('w') as f:
        f.write(md5.hexdigest())

    with path.with_suffix(path.suffix + '.sha1').open('w') as f:
        f.write(sha1.hexdigest())



def copy_javadoc(sdk, javadoc_path):
    with zipfile.ZipFile(str(javadoc_path), 'w', zipfile.ZIP_DEFLATED) as javadoc:
        javadoc.writestr('META-INF/MANIFEST.MF', b'Manifest-Version: 1.0\n\n')
        for info in sdk.infolist():
            if not info.filename.startswith('doc/'):
                continue
            content = sdk.read(info)
            javadoc.writestr(info.filename[4:], content)



POM_TEMPLATE = '''\
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>hihex.sbrc</groupId>
    <artifactId>sbrc</artifactId>
    <version>{version}</version>
    <packaging>aar</packaging>
</project>
'''



def main():
    parser = create_arg_parser()
    ns = parser.parse_args()

    update_maven_metadata(ns.version)

    with zipfile.ZipFile(ns.input) as sdk:
        d = pathlib.Path('hihex/sbrc/sbrc/' + ns.version)
        stem = 'sbrc-' + ns.version

        try:
            d.mkdir(parents=True)
        except FileExistsError:
            pass

        aar_path = d / (stem + '.aar')
        sdk.extract('sbrc.aar', path=str(d))
        (d / 'sbrc.aar').rename(aar_path)
        write_checksum(aar_path)

        javadoc_path = d / (stem + '-javadoc.jar')
        copy_javadoc(sdk, javadoc_path)
        write_checksum(javadoc_path)

    pom_path = d / (stem + '.pom')
    pom_content = POM_TEMPLATE.format(version=ns.version)
    with pom_path.open('w') as f:
        f.write(pom_content)
    write_checksum(pom_path)


if __name__ == '__main__':
    main()

