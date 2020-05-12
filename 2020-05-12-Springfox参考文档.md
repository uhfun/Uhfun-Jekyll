---
layout: post
post: 
  title: Springfox参考文档（Springfox Reference Documentation 中文版）
  type: article
date: 2020-01-15 15:10:00 +0800
categories: 
  - tech
tags: 
  - Swagger
  - Springfox
  - 文档
---

Version 2.9.2-SNAPSHOT

## 1. 介绍

Springfox Java库套件主要是为使用[Spring系列项目](http://projects.spring.io/spring-framework)编写的JSONAPI自动生成机器和人类可读的规范。Springfox的工作原理是在运行时检查一次应用程序，根据Spring配置、类结构和各种编译时java注释推断API语义。

### 1.1. 历史

Springfox是从[马蒂·皮特](https://github.com/martypitt)最初创建的一个项目演变而来的，并被命名为swagger-springmvc。很多荣誉都归功于马蒂。

### 1.2. 目标

* 扩展对许多针对JSON API规范和文档的不断发展的标准的支持，例如：[swagger](http://swagger.io/)、[Raml](http://raml.org/)和[jsonapi](http://jsonapi.org/)。
* 扩展对[Spring webmvc](http://docs.spring.io/spring/docs/current/spring-framework-reference/html/mvc.html)以外的Spring技术的支持
* 从哲学上讲，我们不鼓励在运行时使用对服务描述不重要的(swagger-core)注释。例如，Jackson注释应该总是胜过`@ApiModelProperty`，或者具有比`@ApiModelProperty`更大的权重，或者例如，`@NotNull`或指定@RequestParam#Required应该始终取胜。在无法推断服务/模式特征的情况下，注释仅用于补充文档或覆盖/调整生成的规范。

### 1.3. 它不是什么

由Spring框架贡献者认可或批准

### 1.4. 开发环境

* 文件(File) >> 打开(Open) >> build.gradle

* 确保选中“使用默认Gradle包装器”选项。

* 首次构建

* ```bash
  ./gradlew cleanIdea idea
  ```

* 要发布到本地maven存储库，请执行以下操作

* ```bash
  ./gradlew clean build publishToMavenLocal -i
  ```

> 此版本针对将软件发布为binray/Sonatype进行了优化。为了让Gradle确定版本，Gradle插件依赖于本地文件夹作为克隆的git存储库。下载源代码存档和构建将不起作用！

#### 1.4.1. 预提交构建

* 代码质量(代码覆盖率、检查样式)

* ```bash
  ./gradlew check
  ```

#### 1.4.2. 创建参考文档

构建所有当前文档(构建手写文档和javadoc)，请执行以下操作：

```bash
./gradlew allDocs
```

档在build/all-docs文件夹中生成。发布当前文档的步骤(快照)

```bash
./gradlew publishDocs
```

#### 1.4.3. 更新契约测试

在开发新契约测试时，为了便于用新契约更新现有测试，请取消对[swagger-tract-test/build.gradle](https://github.com/springfox/springfox/blob/master/swagger-contract-tests/build.gradle)中以下行的注释。通常，当我们为已经修复的bug或添加的功能添加新的约定测试时，会发生这种情况，我们在[BugsController](https://github.com/springfox/springfox/blob/master/springfox-spring-web/src/test/java/springfox/documentation/spring/web/dummy/controllers/BugsController.java)或[FeatureDemonstrationService](https://github.com/springfox/springfox/blob/master/springfox-spring-web/src/test/java/springfox/documentation/spring/web/dummy/controllers/FeatureDemonstrationService.java)中创建一个端点来演示新的修复或行为。

```gradle
// NOTE: Uncomment to bulk update contracts
//test {
//  systemProperty("contract.tests.root", "$projectDir/src/test/resources")
//  systemProperty("contract.tests.update", true)
//}
```

#### 1.4.4. 持续集成环境

[Circle CI](https://circleci.com/gh/springfox/springfox)

### 1.5. 发布

要发布Springfox的非快照版本，请执行以下操作：

* 执行Release命令：运行Release需要以下环境变量：
* `GITHUB_TOKEN`
* `BINTRAY_USER_NAME`
* `BINTRAY_PASSWORD`
* `SONATYPE_USER_NAME`
* `SONATYPE_PASSWORD`

建议将[autoenv](https://github.com/kennethreitz/autoenv)与Repo根目录下的.env文件一起使用。

```bash
    ./gradlew release -PreleaseType=<MAJOR|MINOR|PATCH> -i
    ./gradlew publishDocs
```

发布步骤如下：

- 检查git工作区是否干净
- 检查本地git分支是否为主
- 检查本地git分支是否与Origin相同
- Gradle测试
- Gradle检查
- 将所有工件上传(发布)到Bintra
- 在`version.properties`中升级项目版本
- Git tag发布
- Git推送

#### 1.5.1. 快照

这通常由CI服务器完成

```bash
./gradlew publishSnapshot
```

#### 1.5.2. 覆盖部署

要绕过标准发布流并直接上传到binray，请使用以下任务 - 在version.properties中手动设置版本

```bash
./gradlew clean build bintrayUpload -PreleaseType=<MAJOR|MINOR|PATCH>
 --stacktrace
```

#### 1.5.3. 发布文档

要更新现有版本的文档，请传递updateMode开关

```bash
./gradlew releaseDocs
```

#### 1.5.4. 贡献

请参阅[维基](https://github.com/springfox/springfox/wiki)获取一些指导原则

### 1.6 支持

如果您发现问题或错误，请通过[Springfox Github项目](https://github.com/springfox/springfox/issues)提交

## 2.快速入门

### 2.1. 依赖

Springfox库托管在[bintray](https://bintray.com/springfox/maven-repo/springfox/view)和JCenter上。可以在以下位置查看和访问对象：

- Release：
  - https://jcenter.bintray.com/io/springfox/
  - http://jcenter.bintray.com/io/springfox/
- Snapshot
  * http://oss.jfrog.org/simple/oss-snapshot-local/io/springfox/
  * http://oss.jfrog.org/oss-snapshot-local/io/springfox/

Springfox有多个模块，依赖关系将根据所需的API规范标准而有所不同。下面概述了如何包含springfox-swagger2模块，该模块生成Swagger2.0API文档。

#### 2.1.1. Gradle

##### Release

```groovy
repositories {
  jcenter()
}

dependencies {
    compile "io.springfox:springfox-swagger2:2.9.2"
}
```

##### Snapshot

```groovy
repositories {
   maven { url 'http://oss.jfrog.org/artifactory/oss-snapshot-local/' }
}

dependencies {
    compile "io.springfox:springfox-swagger2:2.9.2-SNAPSHOT"
}
```

#### 2.1.2. Maven

##### Release

```xml
<repositories>
    <repository>
      <id>jcenter-snapshots</id>
      <name>jcenter</name>
      <url>https://jcenter.bintray.com/</url>
    </repository>
</repositories>

<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger2</artifactId>
    <version>2.9.2</version>
</dependency>
```

##### Snapshot

```xml
<repositories>
    <repository>
      <id>jcenter-snapshots</id>
      <name>jcenter</name>
      <url>http://oss.jfrog.org/artifactory/oss-snapshot-local/</url>
    </repository>
</repositories>

<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger2</artifactId>
    <version>2.9.2-SNAPSHOT</version>
</dependency>
```



## 3. 快速入门指南

### 3.1. Springfox Spring MVC 和 Spring Boot

```java
/*
 *
 *  Copyright 2015-2018 the original author or authors.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *
 */

package springfox.springconfig;

import com.fasterxml.classmate.TypeResolver;
import org.joda.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.context.request.async.DeferredResult;
import springfox.documentation.builders.ParameterBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.builders.ResponseMessageBuilder;
import springfox.documentation.schema.ModelRef;
import springfox.documentation.schema.WildcardType;
import springfox.documentation.service.ApiKey;
import springfox.documentation.service.AuthorizationScope;
import springfox.documentation.service.SecurityReference;
import springfox.documentation.service.Tag;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger.web.DocExpansion;
import springfox.documentation.swagger.web.ModelRendering;
import springfox.documentation.swagger.web.OperationsSorter;
import springfox.documentation.swagger.web.SecurityConfiguration;
import springfox.documentation.swagger.web.SecurityConfigurationBuilder;
import springfox.documentation.swagger.web.TagsSorter;
import springfox.documentation.swagger.web.UiConfiguration;
import springfox.documentation.swagger.web.UiConfigurationBuilder;
import springfox.documentation.swagger2.annotations.EnableSwagger2;
import springfox.petstore.controller.PetController;

import java.util.List;

import static com.google.common.collect.Lists.*;
import static springfox.documentation.schema.AlternateTypeRules.*;

@SpringBootApplication
@EnableSwagger2 // 1. 启用Springfox SWAGGER 2
@ComponentScan(basePackageClasses = {
    PetController.class
}) // 2. 表示在哪里扫描API Controller
public class Swagger2SpringBoot {

  public static void main(String[] args) {
    ApplicationContext ctx = SpringApplication.run(Swagger2SpringBoot.class, args);
  }


  @Bean
  public Docket petApi() {
    return new Docket(DocumentationType.SWAGGER_2) // 3. Docket是Springfox主要的API配置机制针，它对swagger规范2.0进行了初始化。
        .select() // 4. select()返回一个ApiSelectorBuilder的实例，提供对通过swagger公开的端点的细粒度控制
          .apis(RequestHandlerSelectors.any()) // 5. apis()允许使用谓词来选择RequestHandler。示例使用any(默认)。开箱即用的谓词有any, none, withClassAnnotation, withMethodAnnotation and basePackage。
          .paths(PathSelectors.any()) // 6. paths()允许使用谓词选择路径。示例使用any(默认)。开箱即用的有regex、ant、any、one。
          .build() // 7. 选择器需要在配置Api选择器(apis)和路径选择器(paths)之后构建。
        .pathMapping("/") // 8. 当Servlet具有路径映射时，添加Servlet路径映射。这会使用提供的路径映射为路径添加前缀。
        .directModelSubstitute(LocalDate.class, String.class) // 9. 便捷规则构建器: 在渲染模型属性时使用字符串替换LocalDate，使用type参数替换泛型类型。
        .genericModelSubstitutes(ResponseEntity.class)
        .alternateTypeRules(
            newRule(typeResolver.resolve(DeferredResult.class,
                typeResolver.resolve(ResponseEntity.class, WildcardType.class)),
                typeResolver.resolve(WildcardType.class))) // 10. 带T的ResponseEntity<T> alternateTypeRules()允许更复杂的自定义规则。该示例通常将DeferredResult<ResponseEntity<T>>替换为T。
        .useDefaultResponseMessages(false) // 11. 指示是否需要使用默认http响应代码的标志。
        .globalResponseMessage(RequestMethod.GET, // 12. 允许全局覆盖不同http方法的响应消息。在本例中，我们覆盖了所有GET请求…的错误代码500...
            newArrayList(new ResponseMessageBuilder()
                .code(500)
                .message("500 message")
                .responseModel(new ModelRef("Error")) // 13. 并指示它将使用响应模型错误(将在其他地方定义)。
                .build()))
        .securitySchemes(newArrayList(apiKey())) // 14. 设置用于保护API的安全方案
        .securityContexts(newArrayList(securityContext())) // 15. 提供全局设置操作的安全上下文的方法。这里的想法是，我们提供一种方法来选择要由指定的安全方案之一保护的操作。 
        .enableUrlTemplating(true) // 21. 允许全局配置默认路径/请求/标头参数，这些参数对于api的每个其余操作都是通用的，但在spring控制器方法签名中不需要（例如，身份验证信息）。
        .globalOperationParameters( // 22. 此处添加的参数将是生成的swagger规范中每个API操作的一部分。根据安全性的设置方式，使用的标头的名称可能需要不同。覆盖此值是覆盖默认行为的一种方式。
            newArrayList(new ParameterBuilder()
                .name("someGlobalParameter")
                .description("Description of someGlobalParameter")
                .modelRef(new ModelRef("string"))
                .parameterType("query")
                .required(true)
                .build()))
        .tags(new Tag("Pet Service", "All apis relating to pets")) // 23. 添加标签是定义服务/操作可以选择的所有可用标签的一种方式。目前只有名称和描述。
        .additionalModels(typeResolver.resolve(AdditionalModel.class)) ;// 24. 应用程序中是否存在无法“访问”的模型？不可达是指我们拥有想要描述但没有在任何操作中显式使用的模型。这方面的一个示例是返回序列化为字符串的模型的操作。我们确实希望传达对字符串架构的期望。这正是实现这一目标的一种方式。
  }

  @Autowired
  private TypeResolver typeResolver;

  private ApiKey apiKey() {
    return new ApiKey("mykey", "api_key", "header"); // 16. 这里我们使用apiKey作为由名称MyKey标识的安全架构。
  }

  private SecurityContext securityContext() {
    return SecurityContext.builder()
        .securityReferences(defaultAuth())
        .forPaths(PathSelectors.regex("/anyPath.*")) // 17. 此安全上下文应用于的路径的选择器。
        .build();
  }

  List<SecurityReference> defaultAuth() {
    AuthorizationScope authorizationScope
        = new AuthorizationScope("global", "accessEverything");
    AuthorizationScope[] authorizationScopes = new AuthorizationScope[1];
    authorizationScopes[0] = authorizationScope;
    return newArrayList(
        new SecurityReference("mykey", authorizationScopes)); // 18. 这里我们使用在安全方案MyKey中定义的相同密钥。
  }

  @Bean
  SecurityConfiguration security() {
    return SecurityConfigurationBuilder.builder() // 19. OAuth和apiKey设置的可选swagger-UI安全配置。
        .clientId("test-app-client-id")
        .clientSecret("test-app-client-secret")
        .realm("test-app-realm")
        .appName("test-app")
        .scopeSeparator(",")
        .additionalQueryStringParams(null)
        .useBasicAuthenticationWithAccessCodeGrant(false)
        .build();
  }

  @Bean
  UiConfiguration uiConfig() {
    return UiConfigurationBuilder.builder() // 20. 可选的swagger-ui配置当前仅支持验证url。*孵化* 设置此标志向处理器发出信号，表示生成的路径应尝试并使用表单样式查询扩展。因此，我们可以区分具有相同路径词干但查询字符串组合不同的路径。这方面的一个示例是两个API：一，http://example.org/findCustomersBy?name=Test按名称查找客户。根据RFC6570，这将表示为http://example.org/findCustomersBy{？name}.二，http://example.org/findCustomersBy?zip=76051 按邮编寻找客户。根据RFC6570，表示为http://example.org/findCustomersBy{？zip}.
        .deepLinking(true)
        .displayOperationId(false)
        .defaultModelsExpandDepth(1)
        .defaultModelExpandDepth(1)
        .defaultModelRendering(ModelRendering.EXAMPLE)
        .displayRequestDuration(false)
        .docExpansion(DocExpansion.NONE)
        .filter(false)
        .maxDisplayedTags(null)
        .operationsSorter(OperationsSorter.ALPHA)
        .showExtensions(false)
        .tagsSorter(TagsSorter.ALPHA)
        .supportedSubmitMethods(UiConfiguration.Constants.DEFAULT_SUBMIT_METHODS)
        .validatorUrl(null)
        .build();
  }

}
```

### 3.2. 配置说明

> 这个库广泛使用[谷歌的Guava库](https://github.com/google/guava)。例如，当您看到newArrayList(…)实际上相当于创建一个普通数组列表并向其中添加项。

```java
//This guava code snippet
List<Something> guavaList = newArrayList(new Something());

//... is equivalent to
List<Something> list = new ArrayList<>();
list.add(new Something());
```

有很多更多的选项可以配置摘要。这应该会提供一个良好的开端。

### 3.3. Springfox Spring Data Rest

> 这还在孵化中。

为了使用它。

1. 添加springfox-data-rest依赖项。

#### 3.3.1. Gradle

```groovy
dependencies {
    compile "io.springfox:springfox-data-rest:2.9.2"
}
```

#### 3.3.2. Maven

从springfox-data-rest模块导入配置，如下所示

```xml
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-data-rest</artifactId>
    <version>2.9.2</version>
</dependency>
```

#### 3.3.3. java config

```java
//For java config
@Import({ ... springfox.documentation.spring.data.rest.configuration.SpringDataRestConfiguration.class, ...})
```

#### 3.3.4. xml config

通过定义以下类型的Bean在XML配置中导入Bean

```xml
<bean class="springfox.documentation.spring.data.rest.configuration.SpringDataRestConfiguration.class" />
```

#### 3.4. Springfox对JSR-303的支持

在2.3.2以上的版本中，添加了对bean验证注释的支持，特别是对@NotNull、@Min、@Max和@Size。

为了使用它。

* 添加springfox-bean-validators依赖项。

#### 3.4.1. Gradle

```groovy
dependencies {
    compile "io.springfox:springfox-bean-validators:2.9.2"
}
```

#### 3.4.2. Maven

从springfox-bean-validators模块导入配置，如下所示

```xml
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-bean-validators</artifactId>
    <version>2.9.2</version>
</dependency>
```

#### 3.4.3. java config

```java
//For java config
@Import({ ... springfox.bean.validators.configuration.BeanValidatorPluginsConfiguration.class, ...})
```

#### 3.4.4. xml config

通过定义以下类型的Bean在XML配置中导入Bean

```xml
<bean class="springfox.bean.validators.configuration.BeanValidatorPluginsConfiguration" />
```

### 3.5. Springfox Swagger UI

springfox-swagger-ui [web jar](http://www.webjars.org/)附带[swagger UI](https://github.com/swagger-api/swagger-ui)。要将其包含在标准Spring Boot应用程序中，您可以按如下方式添加依赖项：

```groovy
dependencies {
    compile 'io.springfox:springfox-swagger-ui:2.9.2'
}
```

引入依赖将创建一个包含swagger-UI静态内容的webjar。它添加了一个JSON端点/swagger-resources，其中列出了为给定应用程序配置的所有swagger资源和版本。然后，可以浏览这个Swagger UI页面http://localhost:8080/swagger-ui.html

![](https://springfox.github.io/springfox/docs/current/images/springfox-swagger-ui.png)

swagger UI版本在./build.gradle中指定，其中`swaggerUiVersion`是https：//github.com/swagger-api/swagger-ui[swagger-UI repo]上的GIT tag。

所有内容都由WebJAR约定提供，相对URL采用以下形式：webjars/springfox-swagger-ui/2.9.2/swagger-ui.html

默认情况下，Spring Boot在提供WebJar内容时有合理的默认值。要配置vanilla Spring web mvc应用程序以提供webjar内容，请参阅[webjar文档](http://www.webjars.org/documentation#springmvc)。

与springfox捆绑在一起的swagger-ui使用 *meta-urls* 来配置自身并发现记录的端点。发现的URL如下所示。

| Url                     | 2.5+ 中的新URL                            | 目的                    |
| ----------------------- | ----------------------------------------- | ----------------------- |
| /configuration/security | /swagger-resources/configuration/security | 配置swagger-ui security |
| /configuration/ui       | /swagger-resources/configuration/ui       | 配置swagger-ui 选项     |

由于swagger UI是一种静态资源，因此它需要依赖已知的端点在运行时进行自我配置。所以这些☝️是*很酷的URI，不能更改。有一些是可以[定制](https://springfox.github.io/springfox/docs/current/#q13)的，但是swagger-UI需要在WebContext的根目录下可用。

至于在[哪里提供swagger-UI本身](http://springfox.github.io/springfox/docs/current/#q13)以及在[哪里提供API文档](http://springfox.github.io/springfox/docs/current/#customizing-the-swagger-endpoints)，这些都是完全可配置的。

### 3.6. Springfox RFC6570 支持 **孵化中**

> 请记住，这是试验性的！要使用此功能，请执行以下操作

添加springfox-swagger-ui-rfc6570而不是springfox-swagger-ui作为依赖 [试验swagger-ui-rfc6570](http://mvnrepository.com/artifact/io.springfox.ui/springfox-swagger-ui-rfc6570/1.0.0)。

使用Gradle:

```groovy
dependencies {
    compile 'io.springfox.ui:springfox-swagger-ui-rfc6570:1.0.0'
}
```

使用Maven:

```xml
<dependency>
    <groupId>io.springfox.ui</groupId>
    <artifactId>springfox-swagger-ui-rfc6570</artifactId>
    <version>1.0.0</version>
</dependency>
```

> 新版本已将group id 从*io.springfox*更改为*io.springfox.ui*！

* 启用url模板；([参见#21](http://springfox.github.io/springfox/docs/current/#springfox-swagger2-with-spring-mvc-and-spring-boot))

### 3.7. 保护Swagger-ui

[用户贡献的示例](https://github.com/springfox/springfox/issues/2191#issuecomment-359159833)在浏览器中使用OAuth2和基于Cookie的身份验证。(归功于：[@evser](https://github.com/evser))

```java
protected void configure(HttpSecurity http) throws Exception {
    http.authorizeRequests()
        .anyRequest().authenticated()
        .and().exceptionHandling().accessDeniedHandler(new AccessDeniedHandlerImpl())
        .and().logout().logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler())
        .and().csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
        .and()
        .addFilterBefore(ssoFilter(ApplicationConfiguration.API_BASE_PATH + "/login"), BasicAuthenticationFilter.class)
        .requiresChannel().anyRequest().requireSecure();
  }

  @Bean
  public FilterRegistrationBean oauth2ClientFilterRegistration(OAuth2ClientContextFilter filter) {
    FilterRegistrationBean frb = new FilterRegistrationBean();
    frb.setFilter(filter);
    frb.setOrder(SecurityProperties.DEFAULT_FILTER_ORDER);
    return frb;
  }

  @Bean
  @ConfigurationProperties("oauth2.client")
  public OAuth2ProtectedResourceDetails authDetails() {
    return new AuthorizationCodeResourceDetails();
  }

  @Bean
  public SecurityConfiguration swaggerSecurityConfiguration() {
    return new SecurityConfiguration("client-id", "client-secret", "realm",
        "", "{{X-XSRF-COOKIE}}", ApiKeyVehicle.HEADER, "X-XSRF-TOKEN", ",");
  }

  private Filter ssoFilter(String path) {
    OAuth2ClientAuthenticationProcessingFilter oAuth2ClientAuthenticationFilter = new OAuth2ClientAuthenticationProcessingFilter(path);
    OAuth2RestTemplate oAuth2RestTemplate = new OAuth2RestTemplate(authDetails(), oauth2ClientContext);
    DefaultRedirectStrategy defaultRedirectStrategy = new DefaultRedirectStrategy();
    oAuth2ClientAuthenticationFilter.setRestTemplate(oAuth2RestTemplate);
    oAuth2ClientAuthenticationFilter.setTokenServices(resourceServerTokenServices);
    oAuth2ClientAuthenticationFilter.setAuthenticationSuccessHandler(
        (request, response, authentication) -> {
          String redirectUrl = request.getParameter(REDIRECT_URL_PARAM);
          if (redirectUrl == null) {
            redirectUrl = DEFAULT_REDIRECT_URL;
          } else {
            if (!redirectUrlValidator.validateRedirectUrl(redirectUrl)) {
              request.setAttribute(MESSAGE_ATTRIBUTE_NAME,
                  messageSource.getMessage("ivalid.redirect.url", new String[] { redirectUrl }, LocaleContextHolder.getLocale()));
              response.sendError(HttpStatus.FORBIDDEN.value());
            }
          }
          defaultRedirectStrategy.sendRedirect(request, response, redirectUrl);
        });
    return oAuth2ClientAuthenticationFilter;
    }
  
```

通过授权头配置要保护的Docket：



```java
 @Bean
  public Docket api() throws IOException, URISyntaxException {
    final List<ResponseMessage> globalResponses = Arrays.asList(
        new ResponseMessageBuilder()
            .code(200)
            .message("OK")
            .build(),
        new ResponseMessageBuilder()
            .code(400)
            .message("Bad Request")
            .build(),
        new ResponseMessageBuilder()
            .code(500)
            .message("Internal Error")
            .build());
    final ApiInfo apiInfo = new ApiInfo("REST API", new BufferedReader(new InputStreamReader(getClass().getResourceAsStream(CHANGELOG_FILENAME)))
        .lines()
        .collect(Collectors.joining(System.lineSeparator())),
        "1.0.0-RC1", "", new Contact("team", "", "bla@bla.com"), "", "", Collections.emptyList());
    return new Docket(DocumentationType.SWAGGER_2),
        .securitySchemes(Arrays.asList(new ApiKey("Token Access", HttpHeaders.AUTHORIZATION, In.HEADER.name()))))
        .useDefaultResponseMessages(false)
        .globalResponseMessage(RequestMethod.GET, globalResponses)
        .globalResponseMessage(RequestMethod.POST, globalResponses)
        .globalResponseMessage(RequestMethod.DELETE, globalResponses)
        .globalResponseMessage(RequestMethod.PATCH, globalResponses)
        .select()
        .apis(RequestHandlerSelectors.basePackage("com.controller"))
        .build()
        .apiInfo(apiInfo)
        .directModelSubstitute(Temporal.class, String.class);
  }
```

### 3.8. Springfox示例

[springfox-demos](https://github.com/springfox/springfox-demos)存储库包含许多示例。



## 4. 架构

### 4.1. 背景

当我们开始研究2.0 swagger规范时，我们意识到我们正在重写逻辑来推断服务模型和模式。所以我们决定退一步，把它分成两个步骤。首先，将服务模型推断为内部表示。其次，创建一个映射层，该映射层可以将内部模型映射到不同的规范格式。开箱即用，我们将支持swagger 1.2和swagger 2.0，但这使我们有可能支持其他格式和其他场景，例如RAML、Alps和超媒体格式。

### 4.2. 组件模型

不同的Springfox模块被拆分，如下所示。

```
  +-----------------------------------------------------------------------------------------+
  |                                  springfox-core                                         |
  |                                                                                         |
  |                         包含内部服务和架构描述模型及其构建器  																|
  +------------------------------------------+----------------------------------------------+
                                             ^
  +------------------------------------------+----------------------------------------------+
  |                                  springfox-spi                                          |
  |                                                                                         |
  | 					包含可用于扩展和丰富服务模型的服务提供者接口, 例如特定于swagger的注释处理器 		          |
  +------------------------------------------+----------------------------------------------+
                                             |
                                             |
                  +--------------------------|------------------------+
                  |                          |                        |
  +----------------------------------+       |       +--------------------------------------+
  |        springfox-schema          |       |       |         springfox-spring-web         |
  |                                  |       |       |                                      |
  |     架构推理扩展,帮助构建参数        |       |       |       Spring Web 特定扩展可以          |
  |      模型和响应的架构。             |       |       | 基于RequestMapping的的信息构建服务模型   |
  |                                  |       |       |       这是推断服务模型的核心库           |
  +----------------------------------+       |       +--------------------------------------+
                                             |
        +------------------------------------+------------------------------------+
        |                         springfox-swagger-common                        |
        |                                                                         |
        |                 识别不同的swagger注释的常见的swagger特定扩展                 |
        +----------+--------------------------------------------------------------+
                   ^                          ^                        ^
        +----------+---------+     +----------+---------+     +-----...
        |                    |     |                    |     |
        | springfox-swagger1 |     | springfox-swagger2 |     |
        |                    |     |                    |     |
        +--------------------+     +--------------------+     +-----...

        配置，以及知道如何将服务模型转换为swagger 1.2和swagger 2.0规范文档的映射层。
				还包含每种特定格式的控制器。
```

## 5. Swagger

Springfox同时支持版本[1.2](https://github.com/swagger-api/swagger-spec/blob/master/versions/1.2.md)和版本[2.0](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md)的[Swagger](http://swagger.io/)规范。如果可以，Swagger 2.0规范更可取。

由swagger-core提供的[swagger-core annotations](https://github.com/swagger-api/swagger-core/wiki/Annotations) 通常用于修饰Bing“swagered”的API的Java源代码。Springfox知道Swagger-Core注释，并且会优先使用这些注释而不是推断的默认值。

### 5.1. Swagger 1.2 vs Swagger 2.0

这两个swagger规范之间的一个主要区别是生成的swagger文档的组成。

在Swagger 1.2中，一个应用程序API被表示为一个资源列表和多个API声明，这意味着要生成[多个JSON文件](https://github.com/swagger-api/swagger-spec/blob/master/versions/1.2.md#42-file-structure)。

使用Swagger 2.0，事情就简单多了，可以在单个JSON文件中表示应用程序的API。

### 5.2. 从 swagger-springmvc 进行迁移?

以下是帮助您从1.0.2过渡到2.0的[指南](https://github.com/springfox/springfox/blob/master/docs/transitioning-to-v2.md)。

您可以在[此处](https://github.com/springfox/springfox/blob/v1.0.2/README.md)找到传统文档。

### 5.3. Springfox配置和演示应用程序

[springfox-demos](https://github.com/springfox/springfox-demos)存储库包含许多示例Spring应用程序，可以作为参考。

## 6. 配置Springfox

要启用对swagger规范1.2的支持，请使用@EnableSwagger注释。

要启用对swagger规范2.0的支持，请使用@EnableSwagger2注释。

为了记录服务，我们使用了Docket。这样更符合事实，即表达文档的内容与文档呈现的格式无关。

Docket[代表](https://www.wordnik.com/words/docket)文件内容的摘要或其他简短陈述，一个摘要。

`Docket`帮助配置要记录的服务子集，并按名称对它们进行分组。这方面的重大变化是能够为API选择提供一个富有表现力的谓词。

*示例配置*

```java
  import static springfox.documentation.builders.PathSelectors.*;
  import static com.google.common.base.Predicates.*;

  @Bean
  public Docket swaggerSpringMvcPlugin() {
    return new Docket(DocumentationType.SWAGGER_2)
            .groupName("business-api")
            .select()
               //忽略使用@CustomIgnore注释的控制器
              .apis(not(withClassAnnotation(CustomIgnore.class)) //按RequestHandler选择
              .paths(paths()) // 和按路径
              .build()
            .apiInfo(apiInfo())
            .securitySchemes(securitySchemes())
            .securityContext(securityContext());
  }

  //以下是我们选择与这些路径之一匹配的任何API的示例
  private Predicate<String> paths() {
    return or(
        regex("/business.*"),
        regex("/some.*"),
        regex("/contacts.*"),
        regex("/pet.*"),
        regex("/springsRestController.*"),
        regex("/test.*"));
  }
```

有关方便的谓词列表，请查看[RequestHandlerSelectors](https://github.com/springfox/springfox/blob/master/springfox-core/src/main/java/springfox/documentation/builders/RequestHandlerSelectors.java)和[PathSelectors](https://github.com/springfox/springfox/blob/master/springfox-core/src/main/java/springfox/documentation/builders/PathSelectors.java)。

### 6.1. 配置对象映射器

配置对象映射器的一种简单方法是监听`ObjectMapperConfiguring`事件。无论是否有自定义的ObjectMapper与相应的MappingJackson2HttpMessageConverter配合使用，库中始终有一个已配置的ObjectMapper，该ObjectMapper是为序列化swagger 1.2和swagger 2.0类型而自定义的。

为此，实现ApplicationListener<ObjectMapperConfiguring>接口。该事件具有已配置的ObjectMapper的句柄。在此应用程序事件处理程序中配置特定于应用程序的ObjectMapper定制可确保将特定于应用程序的定制应用于正在运行的每个ObjectMapper。

如果您在应用程序启动期间遇到NullPointerException([像这个问题](https://github.com/springfox/springfox/issues/635))。这很可能是因为`WebMvcConfigurerAdapter`不工作。只有当@EnableWebMvc[注释存在](http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/servlet/config/annotation/WebMvcConfigurer.html)时，才会加载这些适配器，尤其是在非Spring-boot场景中。

如果使用Spring Boot Web MVC，则不需要使用@EnableWebMvc注释，因为框架会自动检测Web MVC的使用情况并根据需要进行自我配置。在此场景中，如果应用程序中存在@EnableWebMvc，Springfox将无法正确生成和公开Swagger UI端点(/swagger-ui.html)。

使用该库需要注意的是，它依赖Jackson进行序列化，更重要的是依赖ObjectMapper。使用gson序列化时出现的[以下问题](http://stackoverflow.com/a/30220562/19219)就很能说明问题。

### 6.2. 自定义swagger endpoints

默认情况下，swagger服务描述在以下URL处生成

*表1. API文档默认路径*

| Swagger 版本 | 文档 Url                    | Group                                           |
| ------------ | --------------------------- | ----------------------------------------------- |
| 1.2          | /api-docs                   | 隐式默认（**default**）组                       |
| 1.2          | /api-docs?group=external    | 通过docket.groupName() 外部（）分组             |
| 2.0          | /v2/api-docs                | 隐式默认（**default**）组                       |
| 2.0          | /v2/api-docs?group=external | 通过docket.groupName() 外部（**external**）分组 |

要自定义这些端点，加载具有以下属性的[属性源](http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/annotation/PropertySource.html)允许重写属性

*表2. API文档路径属性*

| Swagger 版本 | 重写属性                                |
| ------------ | --------------------------------------- |
| 1.2          | springfox.documentation.swagger.v1.path |
| 2.0          | springfox.documentation.swagger.v2.path |

### 6.3. 配置启动

如果您想延迟Sprringfox的启动，您可以选择将自动启动设置为false。要使用的属性是`springfox.document-start`，它可以作为-D jvm 参数传入，也可以通过`application ation.yml/properties`文件中的属性传入。 

*表3. 启动属性*

| 覆盖属性 | 描述                                                         |
| :------- | ------------------------------------------------------------ |
| true     | 这是默认值，它在刷新Spring上下文时自动开始扫描端点           |
| false    | 仅当显式调用Lifecycle#start()方法时，此设置才开始扫描终结点。这对于像Grails这样拥有自己生命周期的框架非常有用。它表示库用户负责启动DocumentationPluginsBootStrapper生命周期。 |

> 请谨慎将此默认值更改为False。这意味着在以线程安全的方式请求swagger端点之前管理插件的启动。

#### 6.4. 通过属性覆盖描述

添加了对解析属性源中的属性以替换某些批注中的表达式的支持。要使用它，只需在您的类路径中定义`applation.properties`、`application.yml`文件或属性文件中的属性，并使用您希望在已知批注中替换的值即可。例如，`@ApiModelProperty(value=“${property1.description}”)`将评估可用属性中的Property1.description。如果没有找到，它将按原样呈现未解析的表达式。

当前支持的批注列表按批注内的优先顺序排列：

*表4. 描述 解决 目标*

| 注解             | 属性         | 目标属性                  | 描述                                                         |
| ---------------- | ------------ | ------------------------- | ------------------------------------------------------------ |
| ApiModelProperty | value        | ModelProperty#description | e.g. `@ApiModelProperty(value="${property1.description}")`   |
| ApiModelProperty | description  | ModelProperty#description | e.g. `@ApiModelProperty(notes="${property1.description}")`   |
| ApiParam         | value        | Parameter#description     | e.g. `@ApiParam(value="${param1.description}")`              |
| ApiImplicitParam | value        | Parameter#description     | e.g. `@ApiImplicitParam(value="${param1.description}")`      |
| ApiOperation     | notes        | Operation#notes           | e.g. `@ApiOperation(notes="${operation1.description}")`      |
| ApiOperation     | summary      | Operation#summary         | e.g. `@ApiOperation(value="${operation1.summary}")`          |
| RequestParam     | defaultValue | Parameter#defaultValue    | e.g. `@RequestParam(defaultValue="${param1.defaultValue}")`  |
| RequestHeader    | defaultValue | Parameter#defaultValue    | e.g. `@RequestHeader(defaultValue="${param1.defaultValue}")` |

有关详细说明，[请参阅此处](https://springfox.github.io/springfox/docs/current/#property-file-lookup)。

#### 6.5. 覆盖属性数据类型

使用`ApiModelProperty#dataType`，我们可以覆盖推断的数据类型。但是，它被限制为只允许使用完全限定的类名指定数据类型。例如，如果我们有以下定义

*示例数据类型覆盖*

```java
// 如果com.qualfied.ReplaceWith不是可以使用Class.forName(...)创建的类
// 原始类将被新类替换
@ApiModelProperty(dataType = "com.qualified.ReplacedWith")
public Original getOriginal() { ... }

// 如果ReplaceWith不是可以使用Class.forName(.)创建的类。原始类将被保留
@ApiModelProperty(dataType = "ReplaceWith")
public Original getAnotherOriginal() { ... }
```

> 在ApiImplitParam#DataType的情况下，由于类型本身通常是标量类型(字符串、整型)，因此使用在Types类springfox-schema/src/main/java/springfox/documentation/schema/Types.java⇒中指定的基类型之一

*原始类型*

```java
private static final Set<String> baseTypes = newHashSet(
      "int",
      "date",
      "string",
      "double",
      "float",
      "boolean",
      "byte",
      "object",
      "long",
      "date-time",
      "__file",
      "biginteger",
      "bigdecimal",
      "uuid");
```

 

### 6.6. Docket XML 配置

要使用该插件，您必须创建一个Spring java配置类，它使用Spring的@Configuration。然后必须在XML应用程序上下文中定义此配置类。

*Xml Configuration*

```xml
<!-- 必须加上，这样springfox才能访问Spring的RequestMappingHandlerMapping  -->
<mvc:annotation-driven/>

<!-- 在@Configuration类上启用Spring POST处理 -->
<context:annotation-config/>

<bean class="com.yourapp.configuration.MySwaggerConfig"/>
```

**配置Bean将配置作为Bean并入XML**

```java
@Configuration
@EnableSwagger //加载框架所需的Spring bean
public class MySwaggerConfig {

   /**
    * 每个docket bean都由swagger-MVC框架获取-允许多个
    * swagger组，即相同的代码库，多个swagger资源清单
    */
   @Bean
   public Docket customDocket(){
      return new Docket(); //此处提供了一些自定义内容
   }

}
```

### 6.7. Docket Spring Java 配置

* 使用`@EnableSwagger`或`@EnableSwagger2`注释。
* 使用Springs@Bean注释定义一个或多个docket实例。

*Java 配置*

```java
@Configuration
@EnableWebMvc // 注意：仅在非Sprringboot应用程序中需要
@EnableSwagger2
@ComponentScan("com.myapp.controllers")
public class CustomJavaPluginConfig {


   @Bean // 不要忘记@Bean注解
   public Docket customImplementation(){
      return new Docket()
            .apiInfo(apiInfo());
            //... 更多可选配置项

   }

   //...
}
```

### 6.8. 支持来自属性文件查找的文档

从`2.7.0`开始，我们支持在给定属性的情况下从以下注释中查找描述，就像属性占位符解析值注释`@value(${key})`一样。以下注释属性支持描述解析。

- `@ApiParam#value()`
- `@ApiImplicitParam#value()`
- `@ApiModelProperty#value()`
- `@ApiOperation#value()`
- `@ApiOperation#notes()`
- `@RequestParam#defaultValue()`
- `@RequestHeader#defaultValue()`

下面是它如何工作的示例

Controller 示例

*SomeController.java*

```java
 @ApiOperation(value = "Find pet by Status",
     notes = "${SomeController.findPetsByStatus.notes}"...)￼ // ①
 @RequestMapping(value = "/findByStatus", method = RequestMethod.GET, params = {"status"})
 public Pet findPetsByStatus(
     @ApiParam(value = "${SomeController.findPetsByStatus.status}",￼ // ②
          required = true,...)
     @RequestParam("status",
         defaultValue="${SomeController.findPetsByStatus.status.default}") String status) {￼ // ③
     //...
 }

 @ApiOperation(notes = "Operation 2", value = "${SomeController.operation2.value}"...)￼ // ④
 @ApiImplicitParams(
     @ApiImplicitParam(name="header1", value="${SomeController.operation2.header1}", ...)￼ // ⑤
 )
 @RequestMapping(value = "operation2", method = RequestMethod.POST)
 public ResponseEntity<String> operation2() {
	 return ResponseEntity.ok("");
 }
   
```

① : @ApiOperation#notes() 示例
② : @ApiParam#value() 示例
③ : @RequestParam#defaultValue() 示例
④ : @ApiOperation#value() 示例
⑤ : @ApiImplicitParams#value() 示例

Model示例

*SomeModel.java*

```java
 public class SomeModel {
    @ApiModelProperty(value = "${SomeModel.someProperty}", ...) // ①
    private long someProperty;
  }
```

① : @ApiModelProperty#value() 示例

要通过外部属性提供这些属性，只需将其添加到您的应用程序属性文件或应用程序配置的任何属性源中，如下所示。当找不到属性占位符时，默认行为是按原样回显表达式。

*application.properties*

```properties
SomeController.findPetsByStatus.notes=Finds pets by status
SomeController.findPetsByStatus.status=Status could be one of ...
SomeController.operation2.header1=Header for bla bla...
SomeController.operation2.value=Operation 2 do something...
SomeModel.someProperty=Some property description
```

####  6.8.1. Swagger 组

swagger组是这个库引入的一个概念，它只是应用程序中swagger资源列表的唯一标识符。引入此概念的原因是为了支持需要多个资源列表的应用程序。为什么需要多个资源列表？-一个Spring Web MVC应用程序服务于多个API，例如面向公众的和面向内部的。-单个Spring Web MVC应用服务于同一API的多个版本。例如v1和v2。

在大多数情况下，应用程序不需要一个以上的资源列表，并且可以忽略swagger组的概念。

#### 6.8.2. 在Swagger 2.0规范中配置operationId的输出

正如Swagger 2.0规范中[引入的operationId](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md#fixed-fields-5)定义一样，operationId参数(在Swagger规范2.0之前的版本中称为昵称)为作者提供了一种使用友好名称描述API操作的方法。Swagger 2.0规范的使用者通常使用此字段来命名生成的客户端中的函数。这方面的一个例子可以在[swagger-codegen项目](https://github.com/swagger-api/swagger-codegen)中看到。

根据Springfox，OperationId的默认值

默认情况下，当在Swager2.0模式下使用Springfox时，`operationID`值将使用以下结构呈现：“[java_method_name_here]Using[HTTP_verb_here]”.。例如，如果有一个方法getPets()连接到HTTP get谓词，Springfox将为operation Id呈现`getPetsUsingGET`。

给定此带注释的方法…在方法上的标准注释

```java
@ApiOperation(value = "") 
@RequestMapping(value = "/pets", method = RequestMethod.GET) 
public Model getAllThePets() {     
  ... 
}
```

默认`operationID`如下所示：

默认渲染的Operation Id

```json
"paths": {
  "/pets": {
    "get": {
            ...
      "operationId":"getAllThePetsUsingGET"
      ...
    }
  }
}
```

自定义Operation Id的值

如果希望覆盖Springfox呈现的默认`operationId`，可以通过在`@ApiOperation`注释中提供的`nickname`来实现。

给定此带注释的方法…nickname覆盖默认operationId

```java
@ApiOperation(value = "", nickname = "getMeAllThePetsPlease")
@RequestMapping(value = "/pets", method = RequestMethod.GET)
public Model getAllThePets() {
    ...
}
```

......自定义的operationId将呈现如下所示：

```json
"paths": {
  "/pets": {
    "get": {
            ...
      "operationId":"getMeAllThePetsPlease"
      ...
    }
  }
}
```

#### 6.8.3. 更改泛型类型的命名方式

默认情况下，带有泛型的类型将标记为‘\u00ab’(<<)、‘\u00bb’(>>)和逗号。这对于像大摇大摆的编解码器这样的东西来说可能是有问题的。您可以通过实现自己的`GenericTypeNamingStrategy`来重写此行为。例如，如果您希望`List<String>`编码为‘ListOfString’，而`Map<String，Object>`编码为‘MapOfStringAndObject’，您可以在插件定制过程中将`forCodeGeneration`定制选项设置为true：

```json
docket.forCodeGeneration(true|false);
```

### 6.9. 缓存

2.1.0中引入的缓存功能已删除。Springfox不再使用缓存抽象来提高API扫描器和阅读器的性能。从2.1.2开始，它已作为内部实现详细信息加入到库中。这是一个运行时的突破性更改，但是，除了在消费应用程序中引入配置更改之外，它并没有真正破坏API兼容性更改，所以我们不会增加次要版本。

### 6.10. 配置安全方案（Security Schemes ）和上下文概述

SpringFox中高级别的安全规定没有深入到代码中，而是具有所有协同工作的不同部分。

* API本身需要受到保护。为了简单起见，这是通过使用Spring安全性来实现的，也可以使用Servlet容器和Tomcat/Jersey等的组合。
* 描述用于保护API的技术的安全方案。Spring fox支持swagger规范支持的任何方案(apiKey、BasicAuth和OAuth2(某些配置文件))。
* 最后是安全上下文，它实际提供了哪些API受哪些方案保护的信息。我认为在您的示例中，您遗漏了拼图的最后一块，即安全上下文，请[参见15](https://springfox.github.io/springfox/docs/current/#getting-started-spring-boot)。

### 6.11. 示例应用程序

有关Spring-boot的示例，请看演示应用程序中的[示例](https://github.com/springfox/springfox-demos)。

## 7. 配置 springfox-staticdocs

> 2.7.0中已弃用对此模块的支持。由于swagger2markup不再支持jdk6，Build很难与较新版本的swagger2markup共存。请使用很棒的[Swagger2Markup库](https://github.com/Swagger2Markup/swagger2markup)中提供的最新说明。

## 8. 安全性

多亏了[Javed Mohammed](https://github.com/mojaiq)，我们现在有了一个示例[OAuth演示](https://github.com/springfox/springfox-oath2-demo)。

> 这是基于 swagger-ui 3.x之前的版本

## 9. 插件

### 9.1. 介绍

任何可用的插件或扩展挂钩都[可以在`spi`模块中使用](https://github.com/springfox/springfox/tree/master/springfox-spi/src/main/java/springfox/documentation/spi)。在SPI模块中，任何以`*plugin`结尾的内容通常都是一个扩展点，供库使用者使用。

Bean验证(JSR-303)是[支持Bean验证](https://github.com/springfox/springfox/tree/master/springfox-bean-validators)的一个很好的例子。它相当简单且范围很小，应该可以让您了解如何创建插件。它是一组作用于`ModelProperty`插件，因此它们是`ModelPropertyBuilderPlugin`的实现。

### 9.2. 可扩展的插件

要显式声明可用的扩展点，请执行以下操作：*在架构级别。架构插件

| 名称                       | 描述                     |
| -------------------------- | ------------------------ |
| ModelBuilderPlugin         | 用于丰富模型             |
| ModelPropertyBuilderPlugin | 用于丰富模型属性         |
| TypeNameProviderPlugin     | 这些是用于覆盖模型的名称 |

*表5. 服务插件*

| 名称                           | 描述                                                         |
| ------------------------------ | ------------------------------------------------------------ |
| ApiListingScannerPlugin        | 用于添加自定义api描述（请参见[示例](https://springfox.github.io/springfox/docs/current/#example-apilistingscannerplugin)） |
| ApiListingBuilderPlugin        | 用于丰富api列表                                              |
| DefaultsProviderPlugin         | 提供您自己的默认值                                           |
| DocumentationPlugin            | 用于丰富文档上下文                                           |
| ExpandedParameterBuilderPlugin | 用于`@ModelAttribute`上下文中使用的参数扩展                  |
| OperationBuilderPlugin         | 用于丰富Operation                                            |
| OperationModelsProviderPlugin  | 用于提供其他模型，您可以使用不同的方式加载这些模型           |
| ParameterBuilderPlugin         | 用于丰富参数（请参见[示例](https://springfox.github.io/springfox/docs/current/#example-prameterbuilderplugin)） |

### 9.3. 创建插件的步骤

> 相同的模式适用于所有的可扩展性机制

1. 实现上述插件接口之一

2. 为插件指定顺序，例如，ApiParameterBuilder在Bean中指定了顺序。通常，Spring插件具有最高优先级，即swagger插件(处理所有@api…的插件。注释)顶部的层信息。因此，您要编写的顺序将需要在末尾分层信息。

3. 每个插件都有

   * 一个 [*contentxt](https://github.com/springfox/springfox/blob/master/springfox-swagger-common/src/main/java/springfox/documentation/swagger/readers/parameter/ApiParamParameterBuilder.java#L47)，并提供对插件执行其工作可能需要的任何信息的访问。

   * 一个[*builder](https://github.com/springfox/springfox/blob/master/springfox-swagger-common/src/main/java/springfox/documentation/swagger/readers/parameter/ApiParamParameterBuilder.java#L49)，来支持的对象类型的*构建器(例如，ModelPropertyBuilderPlugin)将访问ModelPropertyBuilder。在所有插件都有权贡献/丰富底层对象之后，此构建器用于构建模型。

4. 更新插件关心的任何构建器属性

5. 将插件注册为@bean，这样插件注册中心就可以获取它。

   就是这样！

#### 9.3.1. OperationBuilderPlugin示例

此示例由[@koderman](https://github.com/koderman)提供，是[AWS Amazon Api Gateway](https://aws.amazon.com/api-gateway/)集成的自定义扩展。

```java
import static com.google.common.base.Strings.isNullOrEmpty;

import java.util.ArrayList;
import java.util.List;

import org.springframework.core.MethodParameter;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.method.HandlerMethod;

import com.google.common.base.Optional;

import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import springfox.documentation.service.ObjectVendorExtension;
import springfox.documentation.service.StringVendorExtension;
import springfox.documentation.service.VendorExtension;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.OperationBuilderPlugin;
import springfox.documentation.spi.service.contexts.OperationContext;
import springfox.documentation.swagger.annotations.Annotations;
import springfox.documentation.swagger.common.SwaggerPluginSupport;

@Component
@Order(SwaggerPluginSupport.SWAGGER_PLUGIN_ORDER)
public class CustomAwsExtensionsReader implements OperationBuilderPlugin {

	private static final String AWS_X_AMAZON_APIGATEWAY_INTEGRATION = "x-amazon-apigateway-integration";
	private static final String AWS_X_AMAZON_APIGATEWAY_INTEGRATION_TYPE = "type";
	private static final String AWS_X_AMAZON_APIGATEWAY_INTEGRATION_HTTPMETHOD = "httpMethod";
	private static final String AWS_X_AMAZON_APIGATEWAY_INTEGRATION_URI = "uri";
	private static final String AWS_X_AMAZON_APIGATEWAY_INTEGRATION_REQUEST_PARAMS = "requestParameters";
	private static final String AWS_X_AMAZON_APIGATEWAY_INTEGRATION_REQUEST_RESPONSES = "responses";


	@Override
	public void apply(OperationContext context) {

		HandlerMethod handlerMethod = context.getHandlerMethod();
		Optional<ApiOperation> apiOperationOperational = Annotations
				.findApiOperationAnnotation(handlerMethod.getMethod());
		String awsApiGatewayBaseUri  = "";//Fetch it from DB/Service
		
		if (apiOperationOperational.isPresent()) {
			ApiOperation apiOperation = apiOperationOperational.get();
			ObjectVendorExtension extension = new ObjectVendorExtension(
					ensurePrefixed(AWS_X_AMAZON_APIGATEWAY_INTEGRATION));
			extension.addProperty(new StringVendorExtension(AWS_X_AMAZON_APIGATEWAY_INTEGRATION_TYPE, "http"));
			extension.addProperty(new StringVendorExtension(AWS_X_AMAZON_APIGATEWAY_INTEGRATION_HTTPMETHOD, apiOperation.httpMethod()));
			extension.addProperty(new StringVendorExtension(AWS_X_AMAZON_APIGATEWAY_INTEGRATION_URI, awsApiGatewayBaseUri + getRequestUri(handlerMethod)));

			ObjectVendorExtension requestParameters = new ObjectVendorExtension(AWS_X_AMAZON_APIGATEWAY_INTEGRATION_REQUEST_PARAMS);

			processApiParamAnnotation(requestParameters, handlerMethod);
			processApiImplicitParamsAnnotation(handlerMethod, requestParameters);

			ObjectVendorExtension awsResponses = new ObjectVendorExtension(AWS_X_AMAZON_APIGATEWAY_INTEGRATION_REQUEST_RESPONSES);
			processApiResponsesAnnotation( awsResponses,handlerMethod);

			if (requestParameters != null && requestParameters.getValue() != null
					&& requestParameters.getValue().size() > 0) {
				extension.addProperty(requestParameters);
			}
			if (awsResponses != null && awsResponses.getValue() != null
					&& awsResponses.getValue().size() > 0) {
				extension.addProperty(awsResponses);
			}
			
			List<VendorExtension> extensions = new ArrayList<VendorExtension>();
			extensions.add(extension);
			context.operationBuilder().extensions(extensions);

		}
	}

	private String getRequestUri(HandlerMethod handlerMethod){
		RequestMapping requestMapping = handlerMethod.getMethodAnnotation(RequestMapping.class);
		RequestMapping controllerRequestMapping = handlerMethod.getBeanType().getAnnotation(RequestMapping.class);
		String[] paths = requestMapping.path();
		String[] requestPaths = controllerRequestMapping.value();
		String requestUri = "";
		if (requestPaths != null && requestPaths.length > 0) {
			requestUri = requestPaths[0];
			if (paths != null && paths.length > 0) {
				requestUri = requestUri + paths[0];
			}
		}
		return requestUri;
	}
	private void processApiResponsesAnnotation(ObjectVendorExtension awsResponses,HandlerMethod handlerMethod) {
		Optional<ApiResponses> apiResponsesOptional = Annotations
				.findApiResponsesAnnotations(handlerMethod.getMethod());
		if (apiResponsesOptional.isPresent()) {
			ApiResponses apiResponses = apiResponsesOptional.get();
			ApiResponse[] apiResponseArray = apiResponses.value();
			for (ApiResponse apiResponse : apiResponseArray) {
				ObjectVendorExtension awsResponse = new ObjectVendorExtension(String.valueOf(apiResponse.code()));
				awsResponse
						.addProperty(new StringVendorExtension("statusCode", String.valueOf(apiResponse.code())));
				awsResponses.addProperty(awsResponse);
			}

		}
	}

	private void processApiImplicitParamsAnnotation(HandlerMethod handlerMethod,
			ObjectVendorExtension requestParameters) {
		ApiImplicitParams apiImplicitParams = handlerMethod.getMethodAnnotation(ApiImplicitParams.class);
		if (apiImplicitParams != null) {
			String requestParameterIntegration = "";
			String requestParameterMethod = "";
			for (ApiImplicitParam apiImplicitParam : apiImplicitParams.value()) {
				if (apiImplicitParam.paramType() != null && apiImplicitParam.paramType().equals("path")) {
					requestParameterIntegration = "integration.request.path." + apiImplicitParam.name();
					requestParameterMethod = "method.request.path." + apiImplicitParam.name();
					requestParameters.addProperty(
							new StringVendorExtension(requestParameterIntegration, requestParameterMethod));
				} else if (apiImplicitParam.paramType() != null && apiImplicitParam.paramType().equals("query")) {
					requestParameterIntegration = "integration.request.querystring." + apiImplicitParam.name();
					requestParameterMethod = "method.request.querystring." + apiImplicitParam.name();
					requestParameters.addProperty(
							new StringVendorExtension(requestParameterIntegration, requestParameterMethod));
				}
			}
		}
	}

	private void processApiParamAnnotation(ObjectVendorExtension requestParameters, HandlerMethod handlerMethod) {
		MethodParameter[] methodParameters = handlerMethod.getMethodParameters();
		for (MethodParameter methodParameter : methodParameters) {
			ApiParam apiParam = methodParameter.getParameterAnnotation(ApiParam.class);
			String requestParameterIntegration = "";
			String requestParameterMethod = "";
			if (apiParam != null) {
				PathVariable pathVariable = methodParameter.getParameterAnnotation(PathVariable.class);
				RequestParam requestParam = methodParameter.getParameterAnnotation(RequestParam.class);
				if (pathVariable != null) {
					requestParameterIntegration = "integration.request.path." + apiParam.name();
					requestParameterMethod = "method.request.path." + apiParam.name();
					requestParameters.addProperty(
							new StringVendorExtension(requestParameterIntegration, requestParameterMethod));
				} else if (requestParam != null) {
					requestParameterIntegration = "integration.request.querystring." + apiParam.name();
					requestParameterMethod = "method.request.querystring." + apiParam.name();
					requestParameters.addProperty(
							new StringVendorExtension(requestParameterIntegration, requestParameterMethod));
				}
			}
		}
	}

	private String ensurePrefixed(String name) {
		if (!isNullOrEmpty(name)) {
			if (!name.startsWith("x-")) {
				name = "x-" + name;
			}
		}
		return name;
	}

	@Override
	public boolean supports(DocumentationType delimiter) {
		return SwaggerPluginSupport.pluginDoesApply(delimiter);
	}
}
```

[CustomAwsExtensionsReader.java](https://gist.github.com/koderman/d49a67274e33f03405a8e45672794968#file-customawsextensionsreader-java) hosted with ❤ by [GitHub](https://github.com/)

#### 9.3.2. ParameterBuilderPlugin示例

以下是如何手动添加参数的示例。

考虑一下这个Controller，[VersionedController.java](https://github.com/springfox/springfox/blob/master/springfox-spring-config/src/main/java/springfox/springconfig/VersionedController.java)

```java
 @GetMapping("/user")
  public ResponseEntity<User> getUser(
      @VersionApi int version, // ①
      @RequestParam("id") String id) {
    throw new UnsupportedOperationException();
  }
}
```

① : 使用[`@VersionApi`](https://github.com/springfox/springfox/blob/master/springfox-spring-config/src/main/java/springfox/springconfig/VersionApi.java)注释的参数

然后，我们创建插件[VersionApiReader.java](https://github.com/springfox/springfox/blob/master/springfox-spring-config/src/main/java/springfox/springconfig/VersionApiReader.java)来提供自定义参数信息。

```java
@Component
@Order(SwaggerPluginSupport.SWAGGER_PLUGIN_ORDER + 1000) // ①
public class VersionApiReader implements ParameterBuilderPlugin {
  private TypeResolver resolver;

  public VersionApiReader(TypeResolver resolver) {
    this.resolver = resolver;
  }

  @Override
  public void apply(ParameterContext parameterContext) {
    ResolvedMethodParameter methodParameter = parameterContext.resolvedMethodParameter();
    Optional<VersionApi> requestParam = methodParameter.findAnnotation(VersionApi.class);
    if (requestParam.isPresent()) { // ②
      parameterContext.parameterBuilder()
          .parameterType("header")
          .name("v")
          .type(resolver.resolve(String.class)); // ③
    }
  }

  @Override
  public boolean supports(DocumentationType documentationType) {
    return true; // ④
  }
}
```

① : 指定插件的执行顺序。数字越高，稍后就会应用插件。
② : 检查是否对该参数应用了VersionApi。
③ : 使用构建器方法构建具有必要信息的参数。
④ : 如果希望此插件应用于所有文档类型，则返回true。

#### 9.3.3. ApiListingScannerPlugin示例

以下是如何手动添加Api描述的示例。

[Bug1767ListingScanner.java](https://github.com/springfox/springfox/blob/master/swagger-contract-tests/src/main/java/springfox/test/contract/swagger/Bug1767ListingScanner.java)

```java
private final CachingOperationNameGenerator operationNames;

  /**
   * @param operationNames - CachingOperationNameGenerator是
   *                       可用于自动注入的组件Bean
   */
  public Bug1767ListingScanner(CachingOperationNameGenerator operationNames) { // ⑨
    this.operationNames = operationNames;
  }

  @Override
  public List<ApiDescription> apply(DocumentationContext context) {
    return new ArrayList<ApiDescription>(
        Arrays.asList( // ①
            new ApiDescription(
                "/bugs/1767",
                "This is a bug",
                Arrays.asList( // ②
                    new OperationBuilder(
                        operationNames)
                        .authorizations(new ArrayList())
                        .codegenMethodNameStem("bug1767GET") // ③
                        .method(HttpMethod.GET)
                        .notes("This is a test method")
                        .parameters(
                            Arrays.asList( // ④
                                new ParameterBuilder()
                                    .description("search by description")
                                    .type(new TypeResolver().resolve(String.class))
                                    .name("description")
                                    .parameterType("query")
                                    .parameterAccess("access")
                                    .required(true)
                                    .modelRef(new ModelRef("string")) // ⑤
                                    .build()))
                        .responseMessages(responseMessages()) // ⑥
                        .responseModel(new ModelRef("string")) // ⑦
                        .build()),
                false),
            new ApiDescription(
                "different-group", // ⑧
                "/different/2219",
                "This is a bug",
                Arrays.asList(
                    new OperationBuilder(
                        operationNames)
                        .authorizations(new ArrayList())
                        .codegenMethodNameStem("bug2219GET")
                        .method(HttpMethod.GET)
                        .notes("This is a test method")
                        .parameters(
                            Arrays.asList(
                                new ParameterBuilder()
                                    .description("description of bug 2219")
                                    .type(new TypeResolver().resolve(String.class))
                                    .name("description")
                                    .parameterType("query")
                                    .parameterAccess("access")
                                    .required(true)
                                    .modelRef(new ModelRef("string"))
                                    .build()))
                        .responseMessages(responseMessages())
                        .responseModel(new ModelRef("string"))
                        .build()),
                false)));
  }

  /**
   * @return 覆盖默认/全局响应消息的响应消息集合
   */
  private Set<ResponseMessage> responseMessages() { // ⑧
    return newHashSet(new ResponseMessageBuilder()
        .code(200)
        .message("Successfully received bug 1767 or 2219 response")
        .responseModel(new ModelRef("string"))
        .build());
  }

  @Override
  public boolean supports(DocumentationType delimiter) {
    return DocumentationType.SWAGGER_2.equals(delimiter);
  }

}
```

① 添加自定义ApiDescription列表。
② 为每个描述添加操作列表。
③ 注意：代码生成的名称不保证是唯一的。对于这些自定义端点，服务作者有责任确保。
④ 向操作添加了参数。
⑤ 注意：即使对于基元类型，也要确保传入模型引用，这一点很重要。
⑥ 覆盖默认/全局响应消息的响应消息集。
⑦ 操作返回的默认模型的响应模型引用。通常在200或201响应中返回响应模型。
⑧ 可以选择提供组名，如果提供，此API将仅显示在该组下。如果没有，接口会出现在默认组下。
⑨ CachingOperationNameGenerator是可用于自动注入的组件Bean

## 10. 其他扩展性选项

*表6. 其他扩展点*

| 名称                        | 描述                                                         | 发布自 |
| --------------------------- | ------------------------------------------------------------ | ------ |
| `RequestHandlerCombiner`1   | 用于组合在给定相同输入条件但生成不同输出的情况下对相同API端点做出反应的API。我们提供了DefaultRequestHandlerCombiner，但这是为自定义它而添加的扩展点。 | 2.7.0  |
| AlternateTypeRuleConvention | 以提供基于约定的类型规则。理想情况下，我们在定义单个类型很麻烦的时候使用它们，因为它们太多了，甚至在某些情况下，仅仅为了OpenAPI文档而需要创建混合类型。[JacksonSerializerConvention](https://github.com/springfox/springfox/blob/ef1721afc4c910675d9032bee59aea8e75e06d27/springfox-spring-web/src/main/java/springfox/documentation/spring/web/plugins/JacksonSerializerConvention.java)是我们如何将规则应用于使用JsonSerialize/JsonResourialize注释的类型的示例 | 2.7.0  |
| SwaggerResourcesProvider    | 可扩展性，它允许覆盖如何为swagger的资源提供服务。默认情况下，我们提供托管在同一应用程序上的API。这也可用于聚合API。 | 2.7.0  |

> 1.这目前的缺点在于，当前响应仍然隐藏其中一个响应表示。这是OAI规范2.0的一个限制。

### 10.1. 替代类型规则约定示例

#### 10.1.1. JacksonSerializerConvention

下面是我们如何配置JacksonSerializerConvention。

> 此功能需要[反射库](https://mvnrepository.com/artifact/org.reflections/reflections/0.9.10)。

[FunctionContractSpec.java](https://github.com/springfox/springfox/blob/c48a8bb019371cb1e3c79d24c3db3791ac5025cc/swagger-contract-tests/src/test/groovy/springfox/test/contract/swaggertests/FunctionContractSpec.groovy#L201-L204)

```java
    @Bean
    AlternateTypeRuleConvention jacksonSerializerConvention(TypeResolver resolver) {
      new JacksonSerializerConvention(resolver, "springfox.documentation.spring.web.dummy.models")
    }
  }
}
```

#### 10.1.2. 创建一个convention

下面是创建规则的示例，该规则自动提供配置`Pageable`可分页类型的约定。

[SpringDataRestConfiguration.java](https://github.com/springfox/springfox/blob/ef1721afc4c910675d9032bee59aea8e75e06d27/springfox-data-rest/src/main/java/springfox/documentation/spring/data/rest/configuration/SpringDataRestConfiguration.java#L46-L64)

```java
 @Bean
  public AlternateTypeRuleConvention pageableConvention(
      final TypeResolver resolver,
      final RepositoryRestConfiguration restConfiguration) {
    return new AlternateTypeRuleConvention() {

      @Override
      public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
      }

      @Override
      public List<AlternateTypeRule> rules() {
        return newArrayList(
            newRule(resolver.resolve(Pageable.class), resolver.resolve(pageableMixin(restConfiguration)))
        );
      }
    };
  }

  private Type pageableMixin(RepositoryRestConfiguration restConfiguration) {
    return new AlternateTypeBuilder()
        .fullyQualifiedClassName(
            String.format("%s.generated.%s",
                Pageable.class.getPackage().getName(),
                Pageable.class.getSimpleName()))
        .withProperties(newArrayList(
            property(Integer.class, restConfiguration.getPageParamName()),
            property(Integer.class, restConfiguration.getLimitParamName()),
            property(String.class, restConfiguration.getSortParamName())
        ))
        .build();
  }

  private AlternateTypePropertyBuilder property(Class<?> type, String name) {
    return new AlternateTypePropertyBuilder()
        .withName(name)
        .withType(type)
        .withCanRead(true)
        .withCanWrite(true);
  }
}
```

它涉及到创建一个生成的内存中类型，该类型允许Sprringfox推理引擎使用新类型而不是`Pageable`可分页的类型。

[SpringDataRestConfiguration.java](https://github.com/springfox/springfox/blob/ef1721afc4c910675d9032bee59aea8e75e06d27/springfox-data-rest/src/main/java/springfox/documentation/spring/data/rest/configuration/SpringDataRestConfiguration.java#L68-L88)

```java
private Type pageableMixin(RepositoryRestConfiguration restConfiguration) {
    return new AlternateTypeBuilder()
        .fullyQualifiedClassName(
            String.format("%s.generated.%s",
                Pageable.class.getPackage().getName(),
                Pageable.class.getSimpleName()))
        .withProperties(newArrayList(
            property(Integer.class, restConfiguration.getPageParamName()),
            property(Integer.class, restConfiguration.getLimitParamName()),
            property(String.class, restConfiguration.getSortParamName())
        ))
        .build();
  }

  private AlternateTypePropertyBuilder property(Class<?> type, String name) {
    return new AlternateTypePropertyBuilder()
        .withName(name)
        .withType(type)
        .withCanRead(true)
        .withCanWrite(true);
  }
}
```

### 10.2. 在同一swagger-ui中聚合多个swagger规范

您需要创建实现[`SwaggerResourcesProvider`](https://github.com/springfox/springfox/blob/cef36c0b0a3e20ef2cb0c23a76ee34866abaf490/springfox-swagger-common/src/main/java/springfox/documentation/swagger/web/SwaggerResourcesProvider.java#L25-L26)接口的bean。通常，您必须创建一个使用多个[InMemorySwaggerResourcesProvider](https://github.com/springfox/springfox/blob/cef36c0b0a3e20ef2cb0c23a76ee34866abaf490/springfox-swagger-common/src/main/java/springfox/documentation/swagger/web/InMemorySwaggerResourcesProvider.java#L38)的复合bean，并向其中添加您自己的json文件。

> 您需要使这个新bean成为@Primary bean。否则，您将得到一个关于模棱两可的bean的异常。

```java
@Configuration
public class SwaggerWsEndpointsConfig {

    @Primary
    @Bean
    public SwaggerResourcesProvider swaggerResourcesProvider(InMemorySwaggerResourcesProvider defaultResourcesProvider) {
        return () -> {
            SwaggerResource wsResource = new SwaggerResource();
            wsResource.setName("ws endpoints");
            wsResource.setSwaggerVersion("2.0");
            wsResource.setLocation("/v2/websockets.json");

            List<SwaggerResource> resources = new ArrayList<>(defaultResourcesProvider.get());
            resources.add(wsResource);
            return resources;
        };
    }
}
```

## 11. Spring Data Rest的可扩展性

> 这些是孵化功能，并且可能会发生变化。

*表7. Spring数据REST可扩展性*

| 名称                                 | 描述                                                         | 发布自 |
| ------------------------------------ | ------------------------------------------------------------ | ------ |
| EntityOperationsExtractor            | 这是提取实体特定操作的扩展点。此提取器允许创建基于Spring-data-rest(SDR)端点的RequestHandler。SDR配置信息可通过`EntityAssociationContext`获得，并可用于推断生成操作描述所需的属性。这是提取实体特定操作的扩展点。此提取器允许创建基于Spring-data-rest(SDR)端点的RequestHandler。SDR配置信息可通过`EntityAssociationContext`获得，并可用于推断生成操作描述所需的属性。 | 2.7.0  |
| EntityAssociationOperationsExtractor | 这是提取与实体关联相关的操作的扩展点。此提取器允许创建基于Spring-Data-REST(SDR)的`RequestHandler`。SDR配置信息可通过``EntityContext`获得，并可用于推断生成操作描述所需的属性。 | 2.7.0  |
| RequestHandlerExtractorConfiguration | 此外，使这一切成为可能的粘合剂是`RequestHandlerExtractorConfiguration`。未自定义时，库使用`DefaultExtractorConfiguration`。 | 2.7.0  |

## 12. 常见问题的解答

**问：为什么Sprringfox忽略控制器方法返回值中的http状态代码？**

答：[Reference #822](https://github.com/springfox/springfox/issues/822#issuecomment-117372109)

**问：swagger-ui和springfox-swagger-ui之间有什么关系？**

答：这可能会让人有点困惑：

* Savagger Spec是一种规格。
* swagger Api-支持JAX-RS、RESTlet、Jersey等规范实现。
* 一般说来，Springfox库是该规范的另一个实现，专注于基于Spring的生态系统。
* js和swagger-ui-是javascript中的客户端库，可以使用swagger规范。
* springfox-swagger-ui-您所指的那个，只是以一种方便的方式打包swagger-ui，以便Spring服务可以提供它。

**问：我用的是gson，不用的是jackson，我该怎么办？**

答：感谢[@chrishuttonch](https://github.com/chrishuttonch)描述了[此问题](https://github.com/springfox/springfox/issues/867)的解决方案

> 我打开了excludeFieldsWithoutExposeAnnotation()，这意味着没有任何对象会生成任何数据。为了解决这个问题，我为以下类创建了几个序列化程序：
>
> ```java
> .registerTypeAdapter(springfox.documentation.service.ApiListing.class, new SwaggerApiListingJsonSerializer())
> .registerTypeAdapter(springfox.documentation.spring.web.json.Json.class, new SwaggerJsonSerializer())
> .registerTypeAdapter(springfox.documentation.swagger.web.SwaggerResource.class, new SwaggerResourceSerializer())
> .registerTypeAdapter(springfox.documentation.service.ResourceListing.class, new SwaggerResourceListingJsonSerializer())
> .registerTypeAdapter(springfox.documentation.swagger.web.SwaggerResource.class, new SwaggerResourceSerializer())
> .registerTypeAdapter(springfox.documentation.swagger.web.SecurityConfiguration.class, new SwaggerSecurityConfigurationSerializer())
> .registerTypeAdapter(springfox.documentation.swagger.web.UiConfiguration.class, new SwaggerUiConfigurationSerializer());
> ```

**问：在springboot应用中ObjectMapper会出错吗？**

答：您可能遇到以下问题之一

1. 启动期间是否存在NPE？

   > 在调试器中运行显示，我的WAR中有两个WebApplicationInitializers实例。Spring正在刷新每个实例的上下文，并在没有`onApplicationEvent`调用的情况下生成`OptimizedModelPropertiesProvider`的第二个实例。我可以通过删除代码中的第二个`WebApplicationInitializer`来修复它。似乎和这个 [spring-boot issue #221](https://github.com/spring-projects/spring-boot/issues/221) 有关。

2. 对象映射器自定义设置不起作用吗？

   > 有时有多个`ObjectMapper`在运行，这可能导致自定义无法工作`HttpMessageConverters`中的Spring Boot首先添加Spring Boot配置的`MappingJackson2HttpMessageConverter`，然后添加来自Spring MVC的默认`MappingJackson2HttpMessageConverter`。这会导致`ObjectMapperConfiguring`事件触发两次，第一次是针对已配置的转换器(实际使用的)，然后是针对默认转换器。所以当你F.E.。设置自定义属性命名策略，然后在`ObjectMapperBeanPropertyNamingStrategy`中，这将被第二个事件覆盖。以下代码修复了此问题：