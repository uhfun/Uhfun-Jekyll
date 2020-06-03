---
layout: post
head-img: https://s1.ax1x.com/2020/06/04/tw87ZV.png
# https://ww1.sinaimg.cn/large/babb3a97ly1gelc6trv2xj21a50u2agc.jpg
post: 
  title: Swagger more如何使用 ？？？
  type: article
  original: true
date: 2020-01-15 15:10:00 +0800
categories: 
  - tech
tags: 
  - Swagger
---
swagger more是一个基于Springfox swagger2扩展的Dubbo Api工具，这里介绍它如何使用。

### 引入依赖
> SNAPSHOT版本

```xml
<repositories>
    <repository>
        <id>oss</id>
        <name>nexus-snapshots</name>
        <url>https://oss.sonatype.org/content/repositories/snapshots/</url>
    </repository>
</repositories>
```
1. 在Api模块中引入注解的依赖

```xml
<dependency>
    <groupId>com.github.uhfun</groupId>
    <artifactId>swagger-more-annotations</artifactId>
    <version>1.0.2-SNAPSHOT</version>
</dependency>
```
2. 在server层引入核心依赖

```xml
<dependency>
     <groupId>com.github.uhfun</groupId>
    <artifactId>swagger-more-core</artifactId>
    <version>1.0.2-SNAPSHOT</version>
</dependency>
```
3. 如果需要使用接口方法的Javadoc生成注解在api包的pom里加上 plugin    
- 替换 "your.app.api.package" 为你自己的包名
  例如 com.mygroup.my-porject-api
  如果有多个用 「,」或「:」或「;」 隔开
- 替换项目API模块 的 your.groupId, your.artifacId, your.version

   ````xml
   <docletArtifact>
   	<groupId>your.groupId</groupId>
   	<artifactId>your.artifactId</artifactId>   
   	<version>your.version</version>
   </docletArtifact>
   ````

**具体配置如下**
```xml
<build>
  <plugins>
    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-javadoc-plugin</artifactId>
      <version>3.1.1</version>
      <executions>
        <execution>
          <goals>
            <goal>javadoc</goal>
          </goals>
          <phase>process-classes</phase>
          <configuration>
            <doclet>com.github.uhfun.swagger.doclet.SwaggerMoreDoclet</doclet>
            <docletArtifacts>
              <docletArtifact>
                 <groupId>com.github.uhfun</groupId>
                 <artifactId>swagger-more-javadoc</artifactId>
                 <version>1.0.2-SNAPSHOT</version>
              </docletArtifact>
              <docletArtifact>
                <groupId>your.groupId</groupId>
                <artifactId>your.artifactId</artifactId>
                <version>your.version</version>
              </docletArtifact>
            </docletArtifacts>
            <additionalOptions>-classDir ${project.build.outputDirectory}</additionalOptions>
            <sourcepath>${project.build.sourceDirectory}</sourcepath>
            <subpackages>your.app.api.package</subpackages>
            <useStandardDocletOptions>false</useStandardDocletOptions>
          </configuration>
        </execution>
      </executions>
    </plugin>
  </plugins>
</build>
```

### 添加配置
```java
@Configuration
@EnableWebMvc
@EnableSwaggerMore
// 1.0.2以上使用@EnableDubboSwaggerAndWebMvc or @EnableDubboSwagger
//@EnableDubboSwaggerAndWebMvc
public class SwaggerConfig {
}
```

### 添加注解
#### 方法注解
**结构如下**
name为请求时的参数   value为解释

```java
@Api(tags = "用户API")
public interface UserService {
    @ApiMethod(value = "保存用户", params = {
            @ApiParam(name = "user", value = "用户")
    })
    String save(User user);
}
```

> 如果api包的pom里加上 plugin , 可以将注解替换为注释, 在项目启动前执行mvn package

```java
/**
 * 用户API
 *
 * @author uhfun
 */
public interface UserService {

    /**
     * 保存用户
     *
     * @param user         用户
     * @return id
     */
    String save(User user);
}
```

#### 实体类注解
[@ApiModelProperty ](https://springfox.github.io/springfox/docs/current/#overriding-resolver-via-properties) 中的参数可以参考官方文档或者里面的官方注释

```java
@ApiModel(description = "用户")
public class User implements Serializable {

    private static final long serialVersionUID = -7182552932351577562L;
    /**
     * 用户id
     */
    @ApiModelProperty(name = "id", required = true, example = "123456789")
    private String id;
    /**
     * 用户名称
     */
    @ApiModelProperty(value = "用户名称", required = true, example = "uhfun")
    private String name;
}
```

### 启动项目、访问文档页面
如果配置了plugin，启动前执行 `mvn package` 

```
官方页面: 
http://baseUrl:port/swagger-ui.html

swagger-more页面:
http://baseUrl:port/api/dubbo
```

