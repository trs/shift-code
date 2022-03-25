# `@shift-code/cli`

> Automatically redeem Gearbox Shift codes

<img src="https://github.com/trs/shift-code/raw/master/cli/docs/shift-code-redeem.gif" alt="Example of a terminal executing the shift-code command" width="700px" />

### Supported Games:

- Tiny Tina's Wonderlands
- Borderlands GOTY
- Borderlands 2
- Borderlands: The Pre-Sequel
- Borderlands 3
- Godfall

### Supported Platforms:

- Steam
- Epic
- PSN
- Xbox
- Stadia

## Install

Download the [latest binary release](https://github.com/trs/shift-code/releases/latest) for your platform:

- [Windows](https://github.com/trs/shift-code/releases/latest/download/shift-code-win.exe)
- [MacOS](https://github.com/trs/shift-code/releases/latest/download/shift-code-macos)
- [Linux](https://github.com/trs/shift-code/releases/latest/download/shift-code-linux)

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

If the email is already associated to an account, it will switch that account to the current active account.

### `redeem`

```sh
shift-code redeem [codes...] [--game <name>] [--platform <name>]
```

Redeem the given codes or all available codes on the current active account.

You can optionally provide one or more `--game` flags to only redeem codes for those games. Same with `--platform`.

```sh
# Will only redeem codes that are for Borderlands 2 and 3 for Xbox
shift-code redeem --game bl2 --game bl3 --platform xbox
```

### `logout`

```sh
shift-code logout
```

Logout from SHiFT and remove the stored session.

### `accounts`

```sh
shift-code accounts
```

List all saved accounts, show current active account

### `cache clear`

```sh
shift-code cache clear
```

Remove all codes from the redemption cache for the current active account.

## FAQ

1. What does `"You need to launch a Shift-enabled game to continue redeeming"` mean?
    - You can only redeem a certain number of SHiFT codes before you'll see this. It means you need to open a SHiFT enabled title and play past the main menu. Once you're loaded in, you can exit the game and continue redeeming.
    - Alternatively, this error will go away after a certain amount of time.
