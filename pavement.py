from paver.easy import *
from paver.setuputils import setup, find_package_data
from paver.easy import options
from setuptools import find_packages
import pkg_resources

import os

try:
    # Optional tasks, only needed for development
    #from github.tools.task import *
    import paver.doctools
    import paver.virtual
    from paver.virtual import bootstrap
    import paver.misctasks
    ALL_TASKS_LOADED = True
except ImportError, e:
    info("some tasks could not not be imported.")
    debug(str(e))
    ALL_TASKS_LOADED = False

name='GeoNode'
version = "1.0.1"


setup(name=name,
      version=version,
      description="Application for serving and sharing geospatial data",
      long_description=""" """,
      classifiers=[
        "Development Status :: 1 - Planning" ], # Get strings from http://pypi.python.org/pypi?%3Aaction=list_classifiers
      keywords='',
      author='GeoNode Developers',
      author_email='dev@geonode.org',
      url='http://geonode.org',
      license='GPL',
      packages = ['capra', 'geonode',],
      package_dir = {'': 'src'},
      include_package_data=True,
      zip_safe=False,
      entry_points="""
      # -*- Entry points: -*-
      """,
      )


options(
    minilib=Bunch(extra_files=['virtual', 'doctools']),
    sphinx=Bunch(
      docroot='docs',
      builddir="_build",
      sourcedir=""
      ),
    virtualenv=Bunch(
      packages_to_install=['pip'],
      dest_dir='./',
      install_paver=True,
      script_name='bootstrap.py',
      paver_command_line='post_bootstrap'
      ),
    )

pkg_rec_spec=pkg_resources.Requirement.parse(name)

options.setup.package_data=find_package_data(package='GeoNode',
                                             only_in_packages=False)

venv = os.environ.get('VIRTUAL_ENV')
req_file = pkg_resources.resource_filename(pkg_rec_spec, 'shared/geonode-requirments.txt')

@task
def install_deps(options):
    """
    Installs all the python deps from a requirments file
    """
    # extend to use bundle
    sh("pip install -r %s" %req_file)


# put bundle on atlas or capra
# download it, then install

@task
def bundle_deps(options):
    # add upload
    sh("pip bundle -r  %s ./geonode.bundle")

def install_bundle(options):
    
    sh("pip install ./geonode.bundle")    

@task
def install_25_deps(options):
    pass
    
@task
def post_bootstrap(options):
    # installs the current package
    sh('bin/pip install -e ./')
    

if ALL_TASKS_LOADED:
    @task
    @needs('generate_setup', 'minilib', 'setuptools.command.sdist')
    def sdist():
        """Overrides sdist to make sure that our setup.py is generated."""
