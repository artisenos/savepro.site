# SavePro

  This is a code bundle for SavePro. The original project is available at https://www.figma.com/design/GhMakNGrGqA8KZSjc78aKS/%D9%86%D8%B3%D8%AE-%D9%85%D9%88%D9%82%D8%B9-SavePro.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
## Deployment

### Netlify (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Sign up for a free account at [Netlify](https://netlify.com)
3. Connect your repository to Netlify
4. Netlify will automatically detect the `netlify.toml` file and build the site
5. Once deployed, go to Site settings > Domain management
6. Add custom domain: `savepro.site`
7. Configure DNS records as instructed by Netlify

### Vercel

1. Push your code to a Git repository
2. Sign up for Vercel at [vercel.com](https://vercel.com)
3. Import your project
4. Deploy
5. Add custom domain in project settings

### Manual Deployment

1. Run `npm run build` to generate the `dist` folder
2. Upload the contents of `dist` to your web server
3. Configure your domain DNS to point to the server

## SEO Optimization

The site includes:
- Meta tags for search engines
- Open Graph tags for social media
- Twitter Card tags
- robots.txt and sitemap.xml in the public folder  
