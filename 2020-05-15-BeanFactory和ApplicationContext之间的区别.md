---
layout: post
# head-img: 
post: 
  title: BeanFactory和ApplicationContext之间的区别
  type: article
  original: true
date: 2020-05-15 20:13:00 +0800
categories: 
  - tech
tags: 
  - Spring
---
BeanFactory和ApplicationContext，从字面上比较好理解，一个是生产bean的工厂，一个是应用的上下文。单纯这么讲似乎有些抽象，不妨来看看官方文档是怎么描述的。

## BeanFactory和ApplicationContext是什么

Two of the most fundamental and important packages in Spring are the `org.springframework.beans` and `org.springframework.context` packages. Code in these packages provides the basis for Spring's *Inversion of Control* (alternately called *Dependency Injection*) features. The `BeanFactory` provides an advanced configuration mechanism capable of managing beans (objects) of any nature, using potentially any kind of storage facility. The [ApplicationContext](http://www.springframework.org/docs/api/org/springframework/context/ApplicationContext.html) builds on top of the BeanFactory (it's a subclass) and adds other functionality such as easier integration with Springs AOP features, message resource handling (for use in internationalization), event propagation, declarative mechanisms to create the ApplicationContext and optional parent contexts, and application-layer specific contexts such as the `WebApplicationContext`, among other enhancements.

> Spring中最基本、最重要的两个包是`org.springframework.beans` 和 `org.springframework.context`。这些包中的代码为Spring的控制反转(也称为依赖注入)特性提供了基础。BeanFactory提供了一种高级配置机制，能够使用任何类型的存储设施来管理任何性质的bean(对象)。ApplicationContext构建在BeanFactory(它是一个子类)之上，并添加了其他功能，例如更容易与Springs AOP特性集成、消息资源处理(用于国际化)、事件传播、用于创建ApplicationContext和可选父上下文的声明性机制，以及诸如WebApplicationContext等应用层特定上下文，以及其他增强功能。

简单来说，BeanFactory提供了配置框架和基本功能，ApplicationContext继承自BeanFactory，同时扩展了很多其他的功能，BeanFactory有的它都有，没有的它也有。

## 两者区别

它们之前有什么区别呢？官方文档中列出了下面的一张表

| 特性                                | `BeanFactory` | `ApplicationContext` |
| ----------------------------------- | ------------- | -------------------- |
| Bean 的实例化/串联                  | ✅             | ✅                    |
| `BeanPostProcessor` 自动注册        | ❌             | ✅                    |
| `BeanFactoryPostProcessor` 自动注册 | ❌             | ✅                    |
| 便捷的国际化访问 (适用于 i18n)      | ❌             | ✅                    |
| `ApplicationEvent` 发布             | ❌             | ✅                    |



## ApplicationContext增强的功能

### BeanPostProcessor扩展点

在Spring2.0中扩展了很多的`BeanPostProcessor`来实现很多功能，首先先来了解`BeanPostProcessor`到底是什么样的

```java
public interface BeanPostProcessor {

   /**
   * 在任何bean初始化回调(如InitializingBean的afterPropertiesSet方法或自定义init-method方法之前，
   * 将此BeanPostProcessor应用于给定的新bean实例。该bean将已经填充了属性值。
   * 返回的bean实例可以是原始bean实例的包装器，默认实现按原样返回给定的{@code bean}
   * @param bean 新的bean实例
   * @param beanName Bean的名称
   * @return 要使用的bean实例，可以是原始的bean实例，也可以是封装的bean实例；
   * 如果为null则不会调用后续BeanPostProcessors
   * @throws 如果出现错误抛出org.springframe work.beans.BeansException
   * @see org.springframework.beans.factory.InitializingBean#afterPropertiesSet
   */
   @Nullable
   default Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
      return bean;
   }

   /**
    * Apply this {@code BeanPostProcessor} to the given new bean instance <i>after</i> any bean
    * initialization callbacks (like InitializingBean's {@code afterPropertiesSet}
    * or a custom init-method). The bean will already be populated with property values.
    * The returned bean instance may be a wrapper around the original.
    * <p>In case of a FactoryBean, this callback will be invoked for both the FactoryBean
    * instance and the objects created by the FactoryBean (as of Spring 2.0). The
    * post-processor can decide whether to apply to either the FactoryBean or created
    * objects or both through corresponding {@code bean instanceof FactoryBean} checks.
    * <p>This callback will also be invoked after a short-circuiting triggered by a
    * {@link InstantiationAwareBeanPostProcessor#postProcessBeforeInstantiation} method,
    * in contrast to all other {@code BeanPostProcessor} callbacks.
    * <p>The default implementation returns the given {@code bean} as-is.
    * @param bean the new bean instance
    * @param beanName the name of the bean
    * @return the bean instance to use, either the original or a wrapped one;
    * if {@code null}, no subsequent BeanPostProcessors will be invoked
    * @throws org.springframework.beans.BeansException in case of errors
    * @see org.springframework.beans.factory.InitializingBean#afterPropertiesSet
    * @see org.springframework.beans.factory.FactoryBean
    */
   @Nullable
   default Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
      return bean;
   }

}
```



