# Borderlands Shift Code Redeemer

![shift logo](https://shift.gearboxsoftware.com/assets/logo-91afdafa421f05688bd3a7adcdbe96e3a4d94a45bf8c246dd9c1935f6b500582.svg "Shift Logo")

Automatically redeem Borderlands Shift codes from the wonderful website http://ticklemezombie.com/shift.

Supports:
- Borderlands
- Borderlands 2
- Borderlands: The Pre-Sequel

## Usage

![preview gif](preview.gif)

1. Install the project dependencies: `npm install`
1. Start the program: `npm run redeem`
1. You will be prompted for your platform and game to redeem on.
1. Once selected, a browser window will open and you will be prompted to login to your Gearbox Shift account.
1. From here, the process will be automated. Just let it do it's thing.
    - Used shift keys are cached in `~/.config/configstore/shift-code-redeemer.json` under the profile email.
