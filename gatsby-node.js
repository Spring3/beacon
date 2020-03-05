module.exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions;

  console.log('page', page);
  
  if (page.path.match(/^\//) && !page.path.match(/^\/dev-404-page/)) {
    page.matchPath = `${page.path}*`;
  }

  createPage(page);
}
