import io

from setuptools import find_packages, setup

with io.open('README.md', 'rt', encoding='utf8') as f:
    readme = f.read()

setup(
    name='redes-socket-client-batalha-naval',
    version='0.1.0',
    url='https://github.com/devpaulosouza/redes-socket-client-batalha-naval',
    author='LauroM;devpaulosouza',
    author_email='lauromilagres@gmail.com;paulosouza.ti@gmail.com',
    description='Trabalho Prático da disciplina Redes I. Jogo Batalha Naval usando socket',
    long_description=readme,
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        'flask',
    ],
)