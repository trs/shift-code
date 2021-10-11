# `@shift-code/cli`

> Automatically redeem Gearbox Shift codes

### Supported Games:

- Borderlands GOTY
- Borderlands 2
- Borderlands: The Pre-Sequel
- Borderlands 3
- Godfall

### Supported Platforms:

- Steam
- Epic
- PSN
- Xbox Live

## Install

Download the [latest binary release](https://github.com/trs/shift-code/releases) (`v0.1.2`) for your platform:

- [Windows](https://github.com/trs/shift-code/releases/download/v0.1.2/shift-code-win.exe)
- [MacOS](https://github.com/trs/shift-code/releases/download/v0.1.2/shift-code-macos)
- [Linux](https://github.com/trs/shift-code/releases/download/v0.1.2/shift-code-linux)

Or, run via NodeJS:

```sh
npm install @shift-code/cli --global
```

## Usage

1. Login to SHiFT: `shift-code login`
1. Enter your shift credentials
1. Redeem available codes: `shift-code redeem`
1. Codes will be automatically redeemed. Just let it do it's thing.

## Commands

### `login`

```sh
shift-code login [--email <email>] [--password <password>]
```

Login to a SHiFT account. Stores the session in the config location.

### `logout`

```sh
shift-code logout
```

Logout from SHiFT and remove the stored session.

### `redeem`

```sh
shift-code redeem [codes...]
```

Redeem the given codes or all available codes using the current login session.

### `cache-clear`

```sh
shift-code cache-clear
```

Remove all codes from the redemption cache.

## FAQ

1. What does `"You need to launch a Borderlands game to continue redeeming"` mean?
    - You can only redeem a certain number of SHiFT codes before you'll see this. It means you need to open a SHiFT enabled title (a Borderlands game) and play past the main menu. Once you're loaded in, you can exit the game and continue redeeming.
