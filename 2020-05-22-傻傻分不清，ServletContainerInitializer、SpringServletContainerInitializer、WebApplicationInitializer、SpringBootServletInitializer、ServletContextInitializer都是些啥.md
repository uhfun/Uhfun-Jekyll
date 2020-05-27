---
layout: post
# head-img: 
post: 
  title: 傻傻分不清，ServletContainerInitializer、SpringServletContainerInitializer、WebApplicationInitializer、SpringBootServletInitializer、ServletContextInitializer都是些啥
  type: article
  original: true
date: 2020-05-22 16:10:00 +0800
categories: 
  - tech
tags: 
  - SpringBoot
  - SpringMVC
  - Spring
---

这几个类乍一看有点像，仔细一看还是有点像，特别是`ServletContainerInitializer`和`ServletContextInitializer`，眼神不好的可能还真看不出来。那它们之间到底有什么区别呢？它们之间有什么联系吗？

## 全限定名

首先我们先来看一下它们的全限定名

* **ServletContainerInitializer**（`javax.servlet.ServletContainerInitializer`）

* **SpringServletContainerInitializer**（org.springframework.web.SpringServletContainerInitializer）

* **WebApplicationInitializer**（org.springframework.web.WebApplicationInitializer）

* **SpringBootServletInitializer**（org.springframework.boot.web.servlet.support.SpringBootServletInitializer）

* **ServletContextInitializer**（org.springframework.boot.web.servlet.ServletContextInitializer）

## ServletContainerInitializer

### ServletContainerInitializer是什么

因为这个不是spring家族的，我们就先来讲一下这个类

`ServletContainerInitializer`是servlet3.0规范中引入的接口，能够让web应用程序在servlet容器启动后做一些自定义的操作。

[ServletContainerInitializer](https://javaee.github.io/javaee-spec/javadocs/javax/servlet/ServletContainerInitializer.html) 基于服务提供者接口（SPI）概念，因此你需要在你的`jar`包目录下添加`META-INF/services/javax.servlet.ServletContainerInitializer`文件，内容就是`ServletContainerInitializer`实现类的全限定名。

> 例如在 `org.springframework:spring-web`的`META-INF/services`中存在 `javax.servlet.ServletContainerInitializer`文件，它的内容就是springMVC提供的实现类 `org.springframework.web.SpringServletContainerInitializer`

### ServletContainerInitializer怎么用

ServletContainerInitializer`只有一个方法

```java
package javax.servlet;
...
public interface ServletContainerInitializer {

    public void onStartup(Set<Class<?>> c, ServletContext ctx) throws ServletException;
}
```

`ServletContainerInitializer#onStartup`方法由Servlet容器调用(必须至少支持Servlet 3.0版本)。我们在这个方法中通过编程的方式去注册`Servlet` `Filter` `Listenner`等组件，代替`web.xml`。

可以配合 [`@HandleTypes`](https://javaee.github.io/javaee-spec/javadocs/javax/servlet/annotation/HandlesTypes.html) 注解，通过指定Class，容器会把所有的指定类的子类作为方法`onStartup` 的参数`Set<Class<?>> c`传递进来

> 例如`SpringServletContainerInitializer`传递了spring自定义的`WebApplicationInitializer`
>
> ```java
> package org.springframework.web;
> ...
> @HandlesTypes(WebApplicationInitializer.class)
> public class SpringServletContainerInitializer implements ServletContainerInitializer {
>   ...
> }
> ```

## SpringServletContainerInitializer和WebApplicationInitializer

我们就接着前面的例子，来讲`SpringServletContainerInitializer`，那为什么和`WebApplicationInitializer`一起讲呢？

### SpringServletContainerInitializer是什么

根据名字不难看出，它比`ServletContainerInitializer`多了`Spring` 的前缀，顾名思义 它是Spring提供的`ServletContainerInitializer`的实现类

### WebApplicationInitializer是什么

`WebApplicationInitializer`是Spring提供的接口，和`ServletContainerInitializer`没有直接关系，但是和它有间接关系。`WebApplicationInitializer`在`SpringServletContainerInitializer`中实例化后被调用。

### SpringServletContainerInitializer和WebApplicationInitializer的关系

它们之间的关系可以理解为，`SpringServletContainerInitializer`实现了servlet容器提供的接口带了个头，接下来的事可以交由 spring自己定义的`WebApplicationInitializer``

``SpringServletContainerInitializer`源码如下，可以看到，`SpringServletContainerInitializer`将传入的 `webAppInitializerClasses` 通过反射实例化，然后根据`@Order`注解排序后，依次调用

```java
@HandlesTypes(WebApplicationInitializer.class)
public class SpringServletContainerInitializer implements ServletContainerInitializer {
   @Override
   public void onStartup(@Nullable Set<Class<?>> webAppInitializerClasses, ServletContext servletContext)
         throws ServletException {
      List<WebApplicationInitializer> initializers = new LinkedList<>();
      if (webAppInitializerClasses != null) {
         for (Class<?> waiClass : webAppInitializerClasses) {
            if (!waiClass.isInterface() && !Modifier.isAbstract(waiClass.getModifiers()) &&
                  WebApplicationInitializer.class.isAssignableFrom(waiClass)) {
               try {
                  initializers.add((WebApplicationInitializer)
                        ReflectionUtils.accessibleConstructor(waiClass).newInstance());
               }
               catch (Throwable ex) {
                  throw new ServletException("Failed to instantiate WebApplicationInitializer class", ex);
               }
            }
         }
      }
      if (initializers.isEmpty()) {
         servletContext.log("No Spring WebApplicationInitializer types detected on classpath");
         return;
      }
      servletContext.log(initializers.size() + " Spring WebApplicationInitializers detected on classpath");
      AnnotationAwareOrderComparator.sort(initializers);
      for (WebApplicationInitializer initializer : initializers) {
         initializer.onStartup(servletContext);
      }
   }

}
```

### SpringServletContainerInitializer和WebApplicationInitializer怎么用

我们可以使用`WebApplicationInitializer`接口来代替`web.xml`配置

#### 继承AbstractAnnotationConfigDispatcherServletInitializer

例如我们自顶一个类，继承Spring为我们提供的`AbstractAnnotationConfigDispatcherServletInitializer`,不需要添加@Configuration等注解，因为Servlet容器会自动将我们自定义的`MyCustomWebApplicationInitializer` class传入`SpringServletContainerInitializer#onStartup`，而`SpringServletContainerInitializer`会为我们实例化这个类并调用它。

```java
public class MyCustomWebApplicationInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {

    /**
     * 为{@linkPlan#createRootApplicationContext()根应用程序上下文}
     * 指定{@code@Configuration}和/或{@code@Component}类
     * @ 返回根应用上下文的配置，如果不需要创建和注册根上下文，则返回{@code null
     */
    @Nullable
    @Override
    protected Class<?>[] getRootConfigClasses() {
        return null;
    }

    /**
     *  为{@linkPlan#createServletApplicationContext()Servlet应用程序上下文}指定
     * {@code@Configuration}和/或{@code@Component}类
     * @返回Servlet应用程序上下文的配置，或者如果所有配置都通过根配置类指定，则为{@code null}
     */
    @Nullable
    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class<?>[]{WebConfig.class};
    }

    /**
    * 指定{@code DispatcherServlet}的Servlet映射
    * 例如{@code“/”}、{@code“/app”}等
    */
    @Override
    protected String[] getServletMappings() {
        return new String[]{"/"};
    }

    /**
    * 返回注册{@link DispatcherServlet}的名称
    * 默认为{@link#Default_Servlet_Name} (public static final String DEFAULT_SERVLET_NAME = "dispatcher";)
    */
    @Override
    protected String getServletName() {
        return "myCustomServletName";
    }
}
```

#### 自己实现WebApplicationInitializer

同样，我们可以实现一个简单版的`WebApplicationInitializer`，效果也是一样的。

```java
public class SimpleWebApplicationInitializer implements WebApplicationInitializer {
    @Override
    public void onStartup(ServletContext servletContext) {
        AnnotationConfigWebApplicationContext webContext = new AnnotationConfigWebApplicationContext();
        servletContext.addListener(new ContextLoaderListener(webContext));
        webContext.register(WebConfig.class);
        ServletRegistration.Dynamic registration = servletContext.addServlet("myCustomServletName", new DispatcherServlet(webContext));
        registration.setLoadOnStartup(1);
        registration.addMapping("/");
    }
}
```

## SpringBootServletInitializer

### SpringBootServletInitializer是什么

同样从名字中我们可以大致猜到，它是`SpringBoot`提供的，`SpringBoot` 替我们实现了一些功能

它是一个抽象类，实现了`WebApplicationInitializer`接口，注意不是Servlet3.0规范提供的那个接口，是`Spring`提供的自家初始化接口，你问我它是做什么的？那我们不如来看看源码是怎么说的

>  这是一个固执己见的 `WebApplicationInitializer` 让我们可以使用传统的WAR包的方式部署运行 `SpringApplication`，可以将 `servlet`、`filter` 和 `ServletContextInitializer` 从应用程序上下文绑定到服务器。
>
> 如果要配置应用程序，要么覆盖 `configure(SpringApplicationBuilder)` 方法(调用 `SpringApplicationBuilder#Sources(Class.)`)，要么使初始化式本身成为 `@configuration`。如果将`SpringBootServletInitializer`与其他 `WebApplicationInitializer` 结合使用，则可能还需要添加`@Ordered`注解来配置特定的启动顺序。
>
> 请注意，只有在构建和部署WAR文件时才需要WebApplicationInitializer。如果您更喜欢运行嵌入式Web服务器，那么您根本不需要这个。

```java
/**
 * An opinionated {@link WebApplicationInitializer} to run a {@link SpringApplication}
 * from a traditional WAR deployment. Binds {@link Servlet}, {@link Filter} and
 * {@link ServletContextInitializer} beans from the application context to the server.
 * <p>
 * To configure the application either override the
 * {@link #configure(SpringApplicationBuilder)} method (calling
 * {@link SpringApplicationBuilder#sources(Class...)}) or make the initializer itself a
 * {@code @Configuration}. If you are using {@link SpringBootServletInitializer} in
 * combination with other {@link WebApplicationInitializer WebApplicationInitializers} you
 * might also want to add an {@code @Ordered} annotation to configure a specific startup
 * order.
 * <p>
 * Note that a WebApplicationInitializer is only needed if you are building a war file and
 * deploying it. If you prefer to run an embedded web server then you won't need this at
 * all.
 *
 * @author Dave Syer
 * @author Phillip Webb
 * @author Andy Wilkinson
 * @since 2.0.0
 * @see #configure(SpringApplicationBuilder)
 */
public abstract class SpringBootServletInitializer implements WebApplicationInitializer {
```

这些话简单来讲什么意思呢？

它是说，如果你需要使用外部容器，打war包然后部署，那么你需要继承这个类然后重写`configure`方法，像这个样子

```java
@SpringBootApplication
public class DemoSpringmvcApplication extends SpringBootServletInitializer {
  @Override
  protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
    return builder.sources(DemoSpringmvcApplication.class);
  }
}

```

如果你觉得内嵌的tomcat挺好用的，那么你就当什么事情都没有发生

### SpringBootServletInitializer怎么运作的

首先你要知道，它是一个 `WebApplicationInitializer`，它的启动靠的是 `SpringServletContainerInitializer`，

而 `SpringServletContainerInitializer`靠的是Servlet容器。所以它的启动靠的就是外部容器。

因此当外部容器启动时，会调用`SpringBootServletInitializer#onStartup`

那我们来看看它的 `onStartup` 方法里做了什么，它首先调用 `createRootApplicationContext`来创建web应用上下文

```java
@Override
public void onStartup(ServletContext servletContext) throws ServletException {
   this.logger = LogFactory.getLog(getClass());
   WebApplicationContext rootAppContext = createRootApplicationContext(servletContext);
   if (rootAppContext != null) {
      servletContext.addListener(new ContextLoaderListener(rootAppContext) {
         @Override
         public void contextInitialized(ServletContextEvent event) {
            // no-op because the application context is already initialized
         }
      });
   }
   else {
      this.logger.debug("No ContextLoaderListener registered, as createRootApplicationContext() did not "
            + "return an application context");
   }
}
```

再来看 `createRootApplicationContext` 方法

```java
protected WebApplicationContext createRootApplicationContext(ServletContext servletContext) {
   SpringApplicationBuilder builder = createSpringApplicationBuilder();
   builder.main(getClass());
   ApplicationContext parent = getExistingRootWebApplicationContext(servletContext);
   if (parent != null) {
      this.logger.info("Root context already created (using as parent).");
      servletContext.setAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE, null);
      builder.initializers(new ParentContextApplicationContextInitializer(parent));
   }
   builder.initializers(new ServletContextApplicationContextInitializer(servletContext));
   builder.contextClass(AnnotationConfigServletWebServerApplicationContext.class);
   builder = configure(builder);
   builder.listeners(new WebEnvironmentPropertySourceInitializer(servletContext));
   SpringApplication application = builder.build();
   if (application.getAllSources().isEmpty()
         && MergedAnnotations.from(getClass(), SearchStrategy.TYPE_HIERARCHY).isPresent(Configuration.class)) {
      application.addPrimarySources(Collections.singleton(getClass()));
   }
   Assert.state(!application.getAllSources().isEmpty(),
         "No SpringApplication sources have been defined. Either override the "
               + "configure method or add an @Configuration annotation");
   // Ensure error pages are registered
   if (this.registerErrorPageFilter) {
      application.addPrimarySources(Collections.singleton(ErrorPageFilterConfiguration.class));
   }
   return run(application);
}
```

1. 如果有父级应用上下文，设置一个初始化器`ParentContextApplicationContextInitializer`，这个初始化器会在`ConfigurableApplicationContext#refresh()` 刷新之前设置父级应用上下文并添加事件监听

2. 设置一个servletContext初始化的初始化器，同样会在 `ConfigurableApplicationContext#refresh()`刷新之前将`servletContext`添加到应用上下文中

3. 设置上下文类型，AnnotationConfigServletWebServerApplicationContext

4. 向此应用程序添加更多源(配置类`@Configuration`和组件`@Component`)。

   > 例如上面启动类重写的`configure`，就是将我们的`DemoSpringmvcApplication`作为配置类添加到了源中，好让启动后能够读到这些配置，因为这个`DemoSpringmvcApplication`拥有`@SpringBootApplication`注解。
   >
   > ```java
   > protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
   >     return builder.sources(DemoSpringmvcApplication.class);
   > }
   > ```
   >
   > 查看源码可知，`@SpringBootApplication`注解就是一个功能更加强大的`@Configuration`
   >
   > ```java
   > @Target(ElementType.TYPE)
   > @Retention(RetentionPolicy.RUNTIME)
   > @Documented
   > @Inherited
   > @SpringBootConfiguration
   > @EnableAutoConfiguration
   > @ComponentScan(excludeFilters = { @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
   >       @Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
   > public @interface SpringBootApplication {
   >   ...
   > }
   > ```

5. 添加`WebEnvironmentPropertySourceInitializer`监听，监听的事件是 `ApplicationEnvironmentPreparedEvent`（当SpringApplication正在启动并且环境首次可供检查和修改时发布的事件）
6. 构建SpringApplication，如果`configure`没有配置源，会检查自己是否是配置类，如果是就加到`primarySources`中，意味着其实如果`SpringBootServletInitializer`的子类就是配置类，默认会添加到source中
7. 确保注册了错误页面
8. 运行

## ServletContextInitializer

#### 什么是ServletContextInitializer

它的方法和`WebApplicationInitializer`一模一样，但是它是`SpringBoot`提供的

我们看看源码怎么描述的

> 用于以编程方式配置Servlet 3.0+{@link ServletContext Context}的接口。与 WebApplicationInitializer 不同的是实现此接口(且不实现 WebApplicationInitializer)的类<b>不会</b>被 SpringServletContainerInitializer 检测到，因此Servlet容器不会自动引导
>
> 此接口的设计方式类似于ServletContainerInitializer，但其生命周期由Spring管理，而不是Servlet容器。
>
> 有关配置示例，请参阅 WebApplicationInitializer

```java
/**
 * Interface used to configure a Servlet 3.0+ {@link ServletContext context}
 * programmatically. Unlike {@link WebApplicationInitializer}, classes that implement this
 * interface (and do not implement {@link WebApplicationInitializer}) will <b>not</b> be
 * detected by {@link SpringServletContainerInitializer} and hence will not be
 * automatically bootstrapped by the Servlet container.
 * <p>
 * This interface is designed to act in a similar way to
 * {@link ServletContainerInitializer}, but have a lifecycle that's managed by Spring and
 * not the Servlet container.
 * <p>
 * For configuration examples see {@link WebApplicationInitializer}.
 *
 * @author Phillip Webb
 * @since 1.4.0
 * @see WebApplicationInitializer
 */
@FunctionalInterface
public interface ServletContextInitializer {

   /**
    * Configure the given {@link ServletContext} with any servlets, filters, listeners
    * context-params and attributes necessary for initialization.
    * @param servletContext the {@code ServletContext} to initialize
    * @throws ServletException if any call against the given {@code ServletContext}
    * throws a {@code ServletException}
    */
   void onStartup(ServletContext servletContext) throws ServletException;

}
```

#### 为什么另外设计了这个接口？

不是可以直接实现一个`ServletContainerInitializer`吗？为什么要另外用这个接口去实现相同的功能。

因为设计者，就是不让内嵌容器支持`ServletContainerInitializer`，可以在这个[issue](https://github.com/spring-projects/spring-boot/issues/321)中找到些答案

This was actually an intentional design decision. The search algorithm used by the containers was problematic. It also causes problems when you want to develop an executable WAR as you often want a `javax.servlet.ServletContainerInitializer` for the WAR that is not executed when you run `java -jar`.

See the `org.springframework.boot.context.embedded.ServletContextInitializer` for an option that works with Spring Beans.

Do you have a specific case where this is causing problems or was it more of an observation?

> 这实际上是一个有意的设计决定。容器使用的搜索算法存在问题。当您想要开发一个可执行的WAR时，这也会导致问题，因为您通常需要一个javax.servlet.ServletContainerInitializer用于在运行java-jar时不执行的WAR。
>
> 有关使用SpringBean的选项，请参阅org.springframework.boot.context.embedded.ServletContextInitializer。

我的理解是，当你的项目在开发时，为了开发方便，你可能使用的是内嵌的容器。而当部署到生成环境可能用的是war包的方式，部署到外部的容器中。这样你的代码必须同时兼容这两种方式。例如这样

```java
@SpringBootApplication
public class DemoSpringmvcApplication extends SpringBootServletInitializer {

    // 使用内嵌容器时，main方法入口在这里，启动初始化的某个时间段我也启动了我的内嵌容器
	  // 使用外部容器时，忽略我的存在
    public static void main(String[] args) {
        SpringApplication.run(DemoSpringmvcApplication.class, args);
    }

    // 使用内嵌容器时，我不会被调用。
    // 外部容器时，外部容器检测到 SpringServletContainerInitializer，然后又检测到继承自WebApplicationInitializer的我，然后我被调用了，初始化也开始了
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources();
    }
}
```

如果内嵌容器支持`ServletContainerInitializer`，那这份代码运行就会有意向不到的问题，当然会有什么问题，我也不清楚😂

#### ServletContextInitializer怎么被调用的

链路很长，我就找`ServletContextInitializer`被调用的关键代码

首先，在`ServletWebServerApplicationContext#onRefresh`里会调用createWebServer，顾名思义，创建web容器

```java
@Override
protected void onRefresh() {
   super.onRefresh();
   try {
      createWebServer();
   }
   catch (Throwable ex) {
      throw new ApplicationContextException("Unable to start web server", ex);
   }
}
```

可以看到，在`createWebServer`根据 `webServer == null && servletContext == null`说明我在创建应用上下文之前并没有外部容器启动，那么就创建一个内嵌容器，`factory.getWebServer(getSelfInitializer())`，传入了servletContextInitializers，

```java
private void createWebServer() {
   WebServer webServer = this.webServer;
   ServletContext servletContext = getServletContext();
   if (webServer == null && servletContext == null) {
      ServletWebServerFactory factory = getWebServerFactory();
      this.webServer = factory.getWebServer(getSelfInitializer());
   }
   else if (servletContext != null) {
      try {
         getSelfInitializer().onStartup(servletContext);
      }
      catch (ServletException ex) {
         throw new ApplicationContextException("Cannot initialize servlet context", ex);
      }
   }
   initPropertySources();
}
```

方法调用 `createWebServer` -> `getWebServer` -> `prepareContext` -> `configureContext`

然后就来到了`configureContext`，有一步很关键，`context.addServletContainerInitializer(starter, NO_CLASSES)`

```java
protected void configureContext(Context context, ServletContextInitializer[] initializers) {
   TomcatStarter starter = new TomcatStarter(initializers);
   if (context instanceof TomcatEmbeddedContext) {
      TomcatEmbeddedContext embeddedContext = (TomcatEmbeddedContext) context;
      embeddedContext.setStarter(starter);
      embeddedContext.setFailCtxIfServletStartFails(true);
   }
   context.addServletContainerInitializer(starter, NO_CLASSES);
   ...
}
```

我们看一下这个方法，它往里面放的不是别人，正是大名鼎鼎的`ServletContainerInitializer`

```java
/**
 * Add a ServletContainerInitializer instance to this web application.
 *
 * @param sci       The instance to add
 * @param classes   The classes in which the initializer expressed an
 *                  interest
 */
public void addServletContainerInitializer(
        ServletContainerInitializer sci, Set<Class<?>> classes);
```

那我们看看这个`TomcatStarter`是何方神圣，仔细一看，里面就是依次调用传入的 ServletContextInitializers

```java
class TomcatStarter implements ServletContainerInitializer {

   private static final Log logger = LogFactory.getLog(TomcatStarter.class);

   private final ServletContextInitializer[] initializers;

   private volatile Exception startUpException;

   TomcatStarter(ServletContextInitializer[] initializers) {
      this.initializers = initializers;
   }
   @Override
   public void onStartup(Set<Class<?>> classes, ServletContext servletContext) throws ServletException {
      try {
         for (ServletContextInitializer initializer : this.initializers) {
            initializer.onStartup(servletContext);
         }
      }
      catch (Exception ex) {
         this.startUpException = ex;
         // Prevent Tomcat from logging and re-throwing when we know we can
         // deal with it in the main thread, but log for information here.
         if (logger.isErrorEnabled()) {
            logger.error("Error starting Tomcat context. Exception: " + ex.getClass().getName() + ". Message: "
                  + ex.getMessage());
         }
      }
   }
   Exception getStartUpException() {
      return this.startUpException;
   }

}
```

看到这里，我们发现了内嵌的tomcat不会以spi方式加载`ServletContainerInitializer`，而是用`TomcatStarter`的onStartup，间接启动`ServletContextInitializers`，来达到`ServletContainerInitializer`的效果。

是不是有点像 `SpringServletContainerInitializer`老大哥带`WebApplicationInitializer`的套路

所以`ServletContextInitializer`源码里让你参考`@see WebApplicationInitializer`也不是没道理

```java
 *
 * @author Phillip Webb
 * @since 1.4.0
 * @see WebApplicationInitializer
 */
@FunctionalInterface
public interface ServletContextInitializer {
```

#### ServletContextInitializer应用

那ServletContextInitializer有现成的应用吗？

有！`DispatcherServletRegistrationBean`，它是什么？`DispatcherServletRegistrationBean`就交由spring的IOC容器管理了，因此`ServletContextInitializer`能够被拿到

```java
@AutoConfigureOrder(Ordered.HIGHEST_PRECEDENCE)
@Configuration(proxyBeanMethods = false)
@ConditionalOnWebApplication(type = Type.SERVLET)
@ConditionalOnClass(DispatcherServlet.class)
@AutoConfigureAfter(ServletWebServerFactoryAutoConfiguration.class)
public class DispatcherServletAutoConfiguration {
  ...
  @Configuration(proxyBeanMethods = false)
	@Conditional(DispatcherServletRegistrationCondition.class)
	@ConditionalOnClass(ServletRegistration.class)
	@EnableConfigurationProperties(WebMvcProperties.class)
	@Import(DispatcherServletConfiguration.class)
	protected static class DispatcherServletRegistrationConfiguration {
		@Bean(name = DEFAULT_DISPATCHER_SERVLET_REGISTRATION_BEAN_NAME)
		@ConditionalOnBean(value = DispatcherServlet.class, name = DEFAULT_DISPATCHER_SERVLET_BEAN_NAME)
		public DispatcherServletRegistrationBean dispatcherServletRegistration(DispatcherServlet dispatcherServlet,
				WebMvcProperties webMvcProperties, ObjectProvider<MultipartConfigElement> multipartConfig) {
			DispatcherServletRegistrationBean registration = new DispatcherServletRegistrationBean(dispatcherServlet,
					webMvcProperties.getServlet().getPath());
			registration.setName(DEFAULT_DISPATCHER_SERVLET_BEAN_NAME);
			registration.setLoadOnStartup(webMvcProperties.getServlet().getLoadOnStartup());
			multipartConfig.ifAvailable(registration::setMultipartConfig);
			return registration;
		}
	}
}
```

它是这么拿的

1. 在前面讲的`org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext#createWebServer` 中调用 factory.getWebServer(getSelfInitializer())

2. 然后调用org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext#getServletContextInitializerBeans

   ```java
   protected Collection<ServletContextInitializer> getServletContextInitializerBeans() {
      return new ServletContextInitializerBeans(getBeanFactory());
   }
   ```

3. `ServletContextInitializerBeans`这个类是一个封装了`ServletContextInitializer`的集合类，通过它的构造方法我们也能发现，它传入了`beanFactory`，不用看源码也能大概猜到它是从Spring容器中去找这些类的bean实例

   ```java
   public ServletContextInitializerBeans(ListableBeanFactory beanFactory,
         Class<? extends ServletContextInitializer>... initializerTypes){}
   ```

## 总结

说了那么多，这些类的出发点都是往`ServletContext`容器中注册`Servlet`,`Filter`或者`EventListener`

只是生命周期由不同的容器托管，在不同的地方调用，但是最终的结果都是一样的

