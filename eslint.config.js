import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import 'eslint-plugin-only-warn';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

export default defineConfig([
	{ languageOptions: { globals: globals.browser } },
	js.configs.recommended,
	tsEslint.configs.recommended,
	stylistic.configs.customize({
		indent: 'tab',
		semi: true,
	}),
]);
