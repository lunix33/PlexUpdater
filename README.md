# PLEX Media Server Updater

This small tool aim to automate the update of PLEX Media Server using the public distribution.
This tool needs to be run manually and don't have any CLI arguments, but do use environnement variables.

**NOTES**: 
* This tool is aimed for linux.
* This tool need to be executed as root since it doesn't just download the package, but also install it.

## Environnement variables

*PU_PLEX_BUILD* :

> Specify the build to be downloaded.
>
> The value must be copied exactly (without the quotes), but must only contain the information needed to identify the version.
> By exemple, if we have the two following build: `Fedora 64-bit (RPM for Fedora 14 or newer)` and `Fedora 32-bit (RPM for Fedora 14 or newer)`, only `Fedora XX-bit` is required.
> To see the list of build see: [PLEX MS Build Reference].
>
> Default: `Ubuntu 64-bit`

*PU_PKG_MNG_PATH* :

> Path to the distribution package manager.
>
> Default: `/usr/bin/dpkg`

*PU_PKG_MNG_ARGS* :

> The installation arguments of the package manager.
>
> *Note*: The tag {pkg} is replaced by the name of the downloaded package.
>
> Default: `-i {pkg}`

[PLEX MS Build Reference]: https://embed.plnkr.co/YzvbGositrtuwAc2Q3nI/?show=preview
