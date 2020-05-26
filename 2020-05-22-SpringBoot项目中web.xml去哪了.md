---
layout: post
# head-img: 
post: 
  title: SpringBoot项目中web.xml去哪了
  type: article
  original: true
date: 2020-05-22 15:10:00 +0800
categories: 
  - tech
tags: 
  - SpringBoot
  - SpringMVC
---

记得在Spring+SpringMVC的日子里，创建一个spring的web项目，必不可少的配置就是在`WEB-INF`目录下添加`web.xml`。为什么在SpringBoot项目中，`web.xml`消失的无影无踪呢？

我的观点是：如果使用外部的tomcat，SpringBoot会通过`ServletContainerInitializer`在`ApplicationContext`应用上下文创建之前就生成ServletContext，但是servlet配置的注册是由`DispatcherServletRegistrationBean`来完成的。而如果使用的内嵌tomcat，就跟`ServletContainerInitializer`没有任何关系了。

网络上很多的观点是ServletContainerInitializer让SpringBoot成功初始化，我觉得他们可能粗略地跟着其他人的解析粗略看了一下源码，就草草地得了一个结论。

源码 SpringBoot的版本是 2.2.2.RELEASE 、Spring版本是5.2.2.RELEASE 。

如果观点有误，请指正！！！

## 了解web.xml

### web.xml是什么

Servlet规范要求Web容器支持**部署描述文件**（web.xml）。Web容器使用**部署描述文件**(Deployment Descriptor,DD)初始化Web应用程序的组件。 

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app version="2.4" 
    xmlns="http://java.sun.com/xml/ns/j2ee" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xsi:schemaLocation="http://java.sun.com/xml/ns/j2ee 
    http://java.sun.com/xml/ns/j2ee/web-app_2_4.xsd">
  <display-name>javaWeb</display-name> 
  <filter>
    <filter-name>CharacterEncodingFilter</filter-name>
    <filter-class>web.filter.CharacterEncodingFilter</filter-class>
  </filter>
  <filter-mapping>
    <filter-name>CharacterEncodingFilter</filter-name>
    <url-pattern>/*</url-pattern>
  </filter-mapping>
  <servlet>
    <servlet-name>UserServlet</servlet-name>
    <servlet-class>cn.uhfun.demo.UserServlet</servlet-class>
  </servlet>
  <servlet-mapping>
    <servlet-name>UserServlet</servlet-name>
    <url-pattern>/user/userServlet</url-pattern>
  </servlet-mapping>
  <welcome-file-list>
    <welcome-file>index.jsp</welcome-file>
  </welcome-file-list>
  ...
</web-app>
```

例如上面的配置，制定了web应用的名称、过滤器（和过滤器class关联，以及指定过滤url）、servlet（和实现类关联，servlet映射）、欢迎页等。

Tomcat容器在部署web应用时，会在初始化阶段加载`web.xml`文件，从而加载servlet及其映射，最终能够对外提供服务。

### SpringMVC中的web.xml

在普通的Java web应用中，我们需要开发很多的Servlet来处理不同的请求。而SpringMVC的核心思想是设计一个功能强大的Servlet（聚合了Spring容器的各种能力）作为前端控制器，协调组织不同的组件，完成请求处理和返回响应。

`DispatcherServlet`是一个继承自`FrameworkServlet`的servlet，在源码中它是这么描述的

```java
/*
* Central dispatcher for HTTP request handlers/controllers, e.g. for web UI controllers
* or HTTP-based remote service exporters. Dispatches to registered handlers for processing
* a web request, providing convenient mapping and exception handling facilities.
 
* 用于HTTP请求处理程序/控制器的中央调度器，例如用于Web UI控制器或基于HTTP的远程服务导出器。
* 调度到注册的处理程序以处理Web请求，从而提供方便的映射和异常处理工具。
*/
```

简单理解就是，它可以让我们以更加灵活便捷的方式来编写请求处理器，例如我们常见的通过注解的方式来编写处理器@controller、@RequestMapping等

因此它的`web.xml`中就出现了`DispatcherServlet`的字样，并且你不再需要其他的Servlet（关于DispatcherServlet的实现细节我会放在后面的文章中重点介绍）：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns="http://java.sun.com/xml/ns/javaee"
        xmlns:web="http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd"
    xsi:schemaLocation="http://java.sun.com/xml/ns/javaee
              http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd"
    id="WebApp_ID" version="3.0">
    <display-name>Spring MVC App</display-name>
    <filter>
        <filter-name>characterEncodingFilter</filter-name>
        <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
        <init-param>
            <param-name>encoding</param-name>
            <param-value>UTF-8</param-value>
        </init-param>
        <init-param>
            <param-name>forceEncoding</param-name>
            <param-value>true</param-value>
        </init-param>
    </filter>
    <filter-mapping>
        <filter-name>characterEncodingFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
    <servlet>
        <servlet-name>MainDispatcherServlet</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>MainDispatcherServlet</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>
</web-app>
```

## SpringBoot中的DispatcherServlet

既然没有了`web.xml`，那SpringBoot中的`DispatcherServlet`是如何被加载的呢？

首先，SpringBoot提供了两种启动的方式，这两种方式在`注册serlvet的配置`时有所不同

### SpringBoot启动方式

1. 使用内嵌web容器，这是比较常见的一种方式

   ```java
   @SpringBootApplication
   public class DemoSpringmvcApplication {
       public static void main(String[] args) {
           SpringApplication.run(DemoSpringmvcApplication.class, args);
       }
   }
   ```

2. 使用外部web容器

   ```java
   @SpringBootApplication
   public class DemoSpringmvcApplication extends SpringBootServletInitializer {
       @Override
       protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
           return builder.sources(DemoSpringmvcApplication.class);
       }
   }
   ```

### SpringBoot自动加载配置原理简析

我们需要先来简单了解一下SpringBoot的加载原理

#### SpringBoot的启动

通常SpringBoot项目都有一个启动类

```java
@SpringBootApplication
public class DemoSpringmvcApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoSpringmvcApplication.class, args);
    }
}
```

SpringApplication的静态方法`run`会将启动类的class作为参数，构建一个SpringApplication的实例，然后调用实例的`run`方法

#### 创建上下文

```java
public class SpringApplication {
  ...
  public static ConfigurableApplicationContext run(Class<?>[] primarySources, String[] args) {
    return new SpringApplication(primarySources).run(args);
  } 
  ...
  public ConfigurableApplicationContext run(String... args) {
    ...
		try {
			...
			context = createApplicationContext();
			exceptionReporters = getSpringFactoriesInstances(SpringBootExceptionReporter.class,
					new Class[] { ConfigurableApplicationContext.class }, context);
			prepareContext(context, environment, listeners, applicationArguments, printedBanner);
			refreshContext(context);
			afterRefresh(context, applicationArguments);
			...
			}
			...
		}
		...
	}
  ...
  private void refreshContext(ConfigurableApplicationContext context) {
		refresh(context);
		...
	}
  ...
  protected void refresh(ApplicationContext applicationContext) {
		Assert.isInstanceOf(AbstractApplicationContext.class, applicationContext);
		((AbstractApplicationContext) applicationContext).refresh();
	}
}
```

调用内部的`protected`方法 `createApplicationContext()`，因为`webApplicationType`为`SERVLET`，通过反射创建了`org.springframework.boot.web.servlet.context.AnnotationConfigServletWebServerApplicationContext`的实例


```java
protected ConfigurableApplicationContext createApplicationContext() {
   Class<?> contextClass = this.applicationContextClass;
   if (contextClass == null) {
      try {
         switch (this.webApplicationType) {
         case SERVLET:
            contextClass = Class.forName(DEFAULT_SERVLET_WEB_CONTEXT_CLASS);
            break;
         case REACTIVE:
            contextClass = Class.forName(DEFAULT_REACTIVE_WEB_CONTEXT_CLASS);
            break;
         default:
            contextClass = Class.forName(DEFAULT_CONTEXT_CLASS);
         }
      }
      ...
   }
   return (ConfigurableApplicationContext) BeanUtils.instantiateClass(contextClass);
}
```

注意！！！在构建实例时，对其中的reader和scanner进行了初始化

```java
public AnnotationConfigServletWebServerApplicationContext() {
   this.reader = new AnnotatedBeanDefinitionReader(this);
   this.scanner = new ClassPathBeanDefinitionScanner(this);
}
```

##### 注册ConfigurationClassPostProcessor的BeanDefinition到容器中

在AnnotatedBeanDefinitionReader构造方法中，会调用AnnotationConfigUtils的方法将ConfigurationClassPostProcessor处理器的beanDefinition添加到容器中

```java
public AnnotatedBeanDefinitionReader(BeanDefinitionRegistry registry, Environment environment) {
   ...
   AnnotationConfigUtils.registerAnnotationConfigProcessors(this.registry);
}
```

```java
public abstract class AnnotationConfigUtils {
  public static Set<BeanDefinitionHolder> registerAnnotationConfigProcessors(
        BeanDefinitionRegistry registry, @Nullable Object source) {
     ...
     Set<BeanDefinitionHolder> beanDefs = new LinkedHashSet<>(8);
     if (!registry.containsBeanDefinition(CONFIGURATION_ANNOTATION_PROCESSOR_BEAN_NAME)) {
        RootBeanDefinition def = new RootBeanDefinition(ConfigurationClassPostProcessor.class);
        def.setSource(source);
        beanDefs.add(registerPostProcessor(registry, def, CONFIGURATION_ANNOTATION_PROCESSOR_BEAN_NAME));
     }
     ...
	}
}
```

#### 刷新应用上下文，invokeBeanFactoryPostProcessors

执行ConfigurationClassPostProcessor的postProcessBeanDefinitionRegistry方法
创建完应用上下文，这时我们再回到`SpringApplication`的非静态`run`方法中的`refreshContext(context);` 

它进入`AbstractApplicationContext`的`refresh`方法，接下里会调用`invokeBeanFactoryPostProcessors`方法，执行`BeanFactoryPostProcessor`中的处理方法，因为`ConfigurationClassParser`的beanDefinition已经在容器中了，所以会被调用

```java
public abstract class AbstractApplicationContext extends DefaultResourceLoader
		implements ConfigurableApplicationContext {
		@Override
    public void refresh() throws BeansException, IllegalStateException {
       synchronized (this.startupShutdownMonitor) {
          // 为刷新做准备，例如
          // 初始化上下文环境中的所有占位符属性源;验证是否所有标记为必需的属性都是可解析的
          prepareRefresh();
          // 获得子类中刷新的Bean工厂
          ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();
          // 准备好在此上下文中使用的bean工厂
          prepareBeanFactory(beanFactory);
          try {
             // 允许在上下文子类中对bean工厂进行后处理
             postProcessBeanFactory(beanFactory);
            // 调用上下文中注册为bean的工厂处理器
            invokeBeanFactoryPostProcessors(beanFactory);
             ...
          }
          ...
       }
    }		
    protected void invokeBeanFactoryPostProcessors(ConfigurableListableBeanFactory beanFactory) {
      PostProcessorRegistrationDelegate.invokeBeanFactoryPostProcessors(beanFactory, getBeanFactoryPostProcessors());
      ...
    }
}
```

#### Import AutoConfigurationImportSelector

解析启动类上的@SpringBootApplication、@EnableAutoConfiguration间接引入的@Import(AutoConfigurationImportSelector.class)
ConfigurationClassParser解析找到注解上的@Import(AutoConfigurationImportSelector.class)

```java
public Iterable<Group.Entry> getImports() {
  for (DeferredImportSelectorHolder deferredImport : this.deferredImports) {
    this.group.process(deferredImport.getConfigurationClass().getMetadata(),
                       deferredImport.getImportSelector());
  }
  return this.group.selectImports();
}
```

#### AutoConfigurationImportSelector找到其他Configuration并自动加载

AutoConfigurationImportSelector通过调用SpringFactoriesLoader的loadFactoryNames方法，找到候选的其他配置类

```java
protected AutoConfigurationEntry getAutoConfigurationEntry(AutoConfigurationMetadata autoConfigurationMetadata,
      AnnotationMetadata annotationMetadata) {
   ...
   List<String> configurations = getCandidateConfigurations(annotationMetadata, attributes);
   configurations = removeDuplicates(configurations);
   ...
}
```

```java
protected List<String> getCandidateConfigurations(AnnotationMetadata metadata, AnnotationAttributes attributes) {
   List<String> configurations = SpringFactoriesLoader.loadFactoryNames(getSpringFactoriesLoaderFactoryClass(),
         getBeanClassLoader());
  ...
}
```

`loadFactoryNames`方法会扫描所有jar包下的META-INF/spring.factories的配置

```java
public static final String FACTORIES_RESOURCE_LOCATION = "META-INF/spring.factories";

private static Map<String, List<String>> loadSpringFactories(@Nullable ClassLoader classLoader) {
		MultiValueMap<String, String> result = cache.get(classLoader);
		if (result != null) {
			return result;
		}

		try {
			Enumeration<URL> urls = (classLoader != null ?
					classLoader.getResources(FACTORIES_RESOURCE_LOCATION) :
					ClassLoader.getSystemResources(FACTORIES_RESOURCE_LOCATION));
			result = new LinkedMultiValueMap<>();
			while (urls.hasMoreElements()) {
				URL url = urls.nextElement();
				UrlResource resource = new UrlResource(url);
				Properties properties = PropertiesLoaderUtils.loadProperties(resource);
				for (Map.Entry<?, ?> entry : properties.entrySet()) {
					String factoryTypeName = ((String) entry.getKey()).trim();
					for (String factoryImplementationName : StringUtils.commaDelimitedListToStringArray((String) entry.getValue())) {
						result.add(factoryTypeName, factoryImplementationName.trim());
					}
				}
			}
			cache.put(classLoader, result);
			return result;
		}
		catch (IOException ex) {
			throw new IllegalArgumentException("Unable to load factories from location [" +
					FACTORIES_RESOURCE_LOCATION + "]", ex);
		}
	}
```

## DispatcherServletAutoConfiguration生效

前面提到的@EnableAutoConfiguration注解使DispatcherServletAutoConfiguration配置类生效

DispatcherServletAutoConfiguration中有两个配置类

* DispatcherServletConfiguration

  通过`@Bean`注册`DispatcherServlet`的bean对象t到spring容器中

* DispatcherServletRegistrationConfiguration

  通过`@Bean`注册DispatcherServletRegistrationBean`的bean对象到spring容器中

### DispatcherServletRegistrationBean是什么？

它实现了`ServletContextInitializer`，下面是ServletContextInitializer源码的描述

```java
/* 
* Interface used to configure a Servlet 3.0+ {@link ServletContext context}
* programmatically. Unlike {@link WebApplicationInitializer}, classes that implement this
* interface (and do not implement {@link WebApplicationInitializer}) will <b>not</b> be
* detected by {@link SpringServletContainerInitializer} and hence will not be
* automatically bootstrapped by the Servlet container.
* <p>
* This interface is designed to act in a similar way to
* {@link ServletContainerInitializer}, but have a lifecycle that's managed by Spring and
* not the Servlet container.

* 用于以编程方式配置Servlet 3.0+{@link ServletContext Context}的接口。
* 与{@link WebApplicationInitializer}不同，
* 实现此接口(且不实现{@link WebApplicationInitializer})的类不会被{@link SpringServletContainerInitializer}检测到，
* 因此不会由Servlet容器自动引导。此接口的设计方式与{@link ServletContainerInitializer}类似，但其生命周期由Spring管理，而不是Servlet容器
```

#### 注册servlet的配置

在`applicationContext`的`onRefresh`阶段会启动servlet配置的注册

SpringBoot根据内嵌还是外部的web容器有不同的操作

如果`webServer == null && servletContext == null`为`true`则使用内嵌的tomcat

使用外部web容器时直接调用 ServletContextInitializer的onStartup方法，最终调用的其实就是前面注册到容器中的`DispatcherServletRegistrationBean`

而使用内嵌容器，`ServletContextInitializer`会在获取内嵌web容器，然后容器启动后被启动（调用onStarup方法）

```java
public class ServletWebServerApplicationContext extends GenericWebApplicationContext
		implements ConfigurableWebServerApplicationContext {
		...
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
    ...
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
		...
}
```

#### **为什么外部web容器启动时servletContext不为null呢**

首先这里需要先提到一个接口`ServletContainerInitializer`

```java
public interface ServletContainerInitializer {  
    void onStartup(Set<Class<?>> c, ServletContext ctx) throws ServletException;
}
```

> Servlet3.0提供了这个接口，在web容器启动时可以让第三方组件机做一些初始化的工作
>
> ServletContainerInitializer(SCI)通过文件META-INF/services/javax.servlet.ServletContainerInitializer中的条目注册，该条目必须包含在包含SCI实现的JAR文件中。
>
> SCI类中的{@link javax.servlet.nortation.HandlesTypes}注解可以作为参数

可以查看依赖 Maven:org.springframework:spring-web:5.2.2.RELEASE 的META-INF/services 中有一个javax.servlet.ServletContainerInitializer文件，它指定了一个ServletContainerInitializer实现类

```
org.springframework.web.SpringServletContainerInitializer
```

查看`SpringServletContainerInitializer`源码可以发现，web容器启动后，所有继承自WebApplicationInitializer的类都会启动

```java
@HandlesTypes(WebApplicationInitializer.class)
public class SpringServletContainerInitializer implements ServletContainerInitializer {
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
     ...
     for (WebApplicationInitializer initializer : initializers) {
        initializer.onStartup(servletContext);
     }
  }
}
```

因为我们自定义启动类 `DemoSpringmvcApplication` 继承自`SpringBootServletInitializer（SpringBootServletInitializer继承自WebApplicationInitializer）`所以会启动

SpringBootServletInitializer启动后，SpringApplicationBuilder设置了initializers，new了一个ServletContextApplicationContextInitializer，里面包含了外部web容器的servletContext。

```java
protected WebApplicationContext createRootApplicationContext(ServletContext servletContext) {
   SpringApplicationBuilder builder = createSpringApplicationBuilder();
	 ...
   builder.initializers(new ServletContextApplicationContextInitializer(servletContext));
   ...
   return run(application);
}
```

在前面提到的`springApplication.run`方法中的`prepareContext(context, environment, listeners, applicationArguments, printedBanner);`

当运行到这里时，会执行初始化器的应用，应用后servletContext就被集成到了applicationContext

```java
private void prepareContext(ConfigurableApplicationContext context, ConfigurableEnvironment environment,
      SpringApplicationRunListeners listeners, ApplicationArguments applicationArguments, Banner printedBanner) {
   context.setEnvironment(environment);
   postProcessApplicationContext(context);
   applyInitializers(context);
   ...
}
```

所以可以通过在`applicationContext onRefresh`阶段`servletContext`是否为空来判断是何种方式启动的

## 总结

SpringBoot有一个关于DispatcherServlet的配置类，DispatcherServlet和DispatcherServletRegistrationBean作为bean注册到了容器中，而servlet配置注册的关键是DispatcherServletRegistrationBean（实现了`ServletContextInitializer`接口）调用`onStarup`方法。

