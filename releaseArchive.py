#!/usr/bin/env python
import os
import zipfile


def zipdir(path, ziph):
    length = len(path)
    exclude = {'.git', '.idea', 'lab'}
    for root, dirs, files in os.walk(path):
        dirs[:] = [d for d in dirs if d not in exclude]
        folder = root[length:]
        for file in files:
            if not(file.endswith('.zip') or file.endswith('.gitignore') or file.endswith('.md') or file.endswith('.py')
                   or file.endswith('LICENSE')):
                ziph.write(os.path.join(root, file), os.path.join(folder, file))


if __name__ == '__main__':
    zipf = zipfile.ZipFile('atc-release.zip', 'w', zipfile.ZIP_DEFLATED)
    zipdir(os.path.dirname(os.path.realpath(__file__)), zipf)
    zipf.close()