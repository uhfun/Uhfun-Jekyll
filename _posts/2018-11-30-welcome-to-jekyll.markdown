---
layout: post
e-unique-title: 19_Nov_30_Sat_Welcome To Jekyll
head-img: /img/head/20191211150239.jpg
post: 
  title:  Welcome to Jekyll!
  type: article

date:   2018-11-30 14:01:38 +0800
categories: tech
tags: 
  - java 
  - test
  - welcome
  - JEKYLL
---


You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. You can rebuild the site in many different ways, but the most common way is to run `jekyll serve`, which launches a web server and auto-regenerates your site when a file is updated.

> Jekyll requires blog post files to be named according to the following format:

`YEAR-MONTH-DAY-title.MARKUP`

Where `YEAR` is a four-digit number, `MONTH` and `DAY` are both two-digit numbers, and `MARKUP` is the file extension representing the format used in the file. After that, include the necessary front matter. Take a look at the source for this post to get an idea about how it works.

Jekyll also offers powerful support for code snippets:
```ruby
def print_hi(name)
  puts "Hi, #{name}"
end
print_hi('Tom')
#=> prints 'Hi, Tom' to STDOUT.
```

```html
<div class="box">
  <article class="media">
    <div class="media-left">
      <figure class="image is-64x64">
        <img src="https://bulma.io/images/placeholders/128x128.png" alt="Image">
      </figure>
    </div>   
  </article>
</div>
```

```java
public class DepartmentNode implements Serializable {

    private static final long serialVersionUID = 4845938329488625366L;
    @ApiModelProperty(value = "组织结构id", required = true, example = "ej6bqq1gPq")
    private String id;

    @ApiModelProperty(value = "节点类型", required = true, example = "department", allowableValues = "shop, department")
    private String type;

    @ApiModelProperty(value = "子级节点", allowEmptyValue = true)
    private List<DepartmentNode> belows = Lists.newArrayList();

    @ApiModelProperty(value = "当前节点用户")
    private List<User> currentNodeUsers = Lists.newArrayList();

    private int userTotal;

    public static DepartmentNode fromDepartment(Department dept) {
        DepartmentNode node = new DepartmentNode();
        node.setId(dept.getId());
        node.setName(dept.getName());
        node.setOrgId(dept.getOrgId());
        node.setType(dept.getType());
        node.setBelows(Lists.newArrayList());
        return node;
    }
}
```

Check out the [Jekyll docs][jekyll-docs] for more info on how to get the most out of Jekyll. File all bugs/feature requests at [Jekyll’s GitHub repo][jekyll-gh]. If you have questions, you can ask them on [Jekyll Talk][jekyll-talk].

[jekyll-docs]: https://jekyllrb.com/docs/home
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-talk]: https://talk.jekyllrb.com/
