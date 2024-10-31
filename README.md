# Blog Management Plugin for Vendure

This plugin adds CMS capabilities to Vendure.  

If you are not familiar with Vendure, you can learn more on [the project web site](https://www.vendure.io/).

Out of the box, this plugin is configured for managing "blog" posts.  However, the plugin has full support for custom fields on all entities.

## Features

- Store and edit posts in HTML or Markdown mode to provide maximum frontend flexibility.
- Use categories, tags, and authors to organize posts (optional).
- Assign tags to posts to enable filtering on your frontend. Posts can have multiple tags. 
- Add essential SEO keywords and description to your posts within Vendure.
- Add related posts to your Vendure products to enable showing blog pages that feature related products and product pages that feature related posts, which can all be managed by the admin in the Vendure dashboard.
- Configure custom fields on posts, authors, categories, and tags for even more flexibility in how you organize and query your content.
- Full Admin UI support for all features.

## Installation

Inside your Vendure project root folder, type:

```bash
yarn add @ovidlabs/blog
```

Replace "yarn add" with the correct command for your package manager if you are using (for example) npm or pnpm.

## Configuration

### Allow Database Synchronization

When you first install the plugin, enable database synchronization.

NOTE: It is recommended to enable synchronization only when in dev mode and when NOT connected to a production database.

`vendure-config.ts`
```ts
dbConnectionOptions: {
	// other settings...
	synchronize: true,
	// other settings...
},
```

Before using in production, you will want to create your own [database migration](https://docs.vendure.io/guides/developer-guide/migrations/).

### Import the Plugin in Your Project Config

`vendure-config.ts`
```ts
import { BlogPlugin } from '@ovidlabs/blog'
```

### Add the Plugin to the Plugins Array

`vendure-config.ts`
```ts
plugins: [
	// other plugins...
	BlogPlugin
]
```

### Add the UI extensions for the Plugin to your Admin UI Plugin

As an example, your AdminUiPlugin configuration might look something like this.  The important set is adding BlogPlugin.uiExtensions to the extensions array.

`vendure-config.ts`
```ts
AdminUiPlugin.init({
	route: 'admin',
	port: 3002,
	app: compileUiExtensions({
		outputPath: path.join(__dirname, '../admin-ui'),
		extensions: [
				BlogPlugin.uiExtensions,
		],
		devMode: true,
	}),
}),
```

## Adding Custom Fields

The new entities in this plugin can be extended in the same way you would extend core Vendure entities.  In this example, we add a subtitle field for blog posts that will be in addition to the main title that already exists.

`vendure-config.ts`
```ts
export const config: VendureConfig = {
	// other settings...
	customFields: {
		BlogPost: [
			{ 
				name: 'subtitle', 
				type: 'string', 
				label: [{ languageCode: LanguageCode.en, value: 'Subtitle' }], 
				public: true,
				nullable: true,
			}
		]
	},
	// other settings...
}
```