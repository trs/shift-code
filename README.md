# Borderlands Shift Code Redeemer

![shift logo](https://shift.gearboxsoftware.com/assets/logo-91afdafa421f05688bd3a7adcdbe96e3a4d94a45bf8c246dd9c1935f6b500582.svg "Shift Logo")

Automatically redeem Borderlands Shift codes from the wonderful website https://shift.orcicorn.com/.

### Supported Games:

- Borderlands GOTY
- Borderlands 2
- Borderlands: The Pre-Sequel
- Borderlands 3

### Supported Platforms:

- Steam
- Epic
- PSN
- Xbox Live


## Install

Download the latest binary release for your platform:

- [Windows](#windows)
- [MacOS](#macos)
- [Linux](#linux)

Or, run via NodeJS:

```sh
npm install shift-code --global
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
    
