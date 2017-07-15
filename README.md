# PLEX Media Server Updater

This small tool aim to automate the update of PLEX Media Server using the public distribution.
This tool needs to be run manually and don't have any CLI arguments, but do use environnement variables.

**NOTE: This tool is aimed for linux.**

## Environnement variables

*PU_PLEX_BUILD* :

> Specify the build to be downloaded.
>
> Default: `linux-ubuntu-x86_64`

*PU_PLEX_DISTRO* :

> Specify the distro at which the build is aimed.
>
> Default: `ubuntu`

*PU_PKG_MANAGER_PATH* :

> Path to the distribution package manager.
>
> Default: `/usr/bin/dpkg`

*PU_PKG_MANAGER_ARGS* :

> The installation arguments of the package manager.
>
> *Note*: The tag {pkg} is replaced by the name of the downloaded package.
>
> Default: `-i {pkg}`

To see all the build and distro available see: [PLEX MS Distro/Build Reference]

*Note*: The build and distro must match one of the groups (indicated by the curlies: `{}`).

[PLEX MS Distro/Build Reference]: https://embed.plnkr.co/YzvbGositrtuwAc2Q3nI/?show=preview
