var api_list = {
  get_category_api: 'http://3.15.190.226:8080/securityknowledge/json_category_findCateList.action',
  get_article_list_api: 'http://3.15.190.226:8080/securityknowledge/json_category_articlelist.action?cateId=',
  get_article_title_api: 'http://3.15.190.226:8080/securityknowledge/json_category_articleTitle.action?artIds=',
  get_article_api: 'http://3.15.190.226:8080/securityknowledge/json_category_findArtInfo.action?artId=',
  search_article_api:'http://3.15.190.226:8080/securityknowledge/json_category_searchTitle.action?search=',
  get_file_url: 'http://3.15.190.226:8080/files/',
  get_local_file_path: 'E:\\0法律法规标准\\安全管理\\',

}

module.exports = {
  api_list: api_list
}