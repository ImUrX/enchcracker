#!/bin/bash -e
mkdir -p temp && cd temp
git clone https://github.com/Earthcomputer/EnchantmentCracker.git 2> /dev/null || ( cd EnchantmentCracker && git pull && cd .. )
mkdir -p lang && rm -rf lang/*
cp EnchantmentCracker/resources/i18n/* ./lang/
cd lang && mv EnchantmentCracker.properties EnchantmentCracker_en.properties
npm run-script parse
