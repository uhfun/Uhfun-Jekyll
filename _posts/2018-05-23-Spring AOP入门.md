---
layout: post
layout: post
post: 
  title: Spring AOP入门
  type: article
categories:
  - tech
tags:
  - AOP
  - Spring
  - 入门
date: 2018-05-23 16:49:00 +0800
---
内容有点多，单独另写一篇了，Spring AOP入门

## 什么是AOP
　　在软件业，AOP为Aspect Oriented Programming的缩写，意为：面向切面编程，通过预编译方式和运行期动态代理实现程序功能的统一维护的一种技术。AOP是OOP的延续，是软件开发中的一个热点，也是Spring框架中的一个重要内容，是函数式编程的一种衍生范型。  
　　利用AOP可以对业务逻辑的各个部分进行隔离，从而使得业务逻辑各部分之间的耦合度降低，提高程序的可重用性，同时提高了开发的效率。  
　　AOP采取横向抽取机制，取代了传统纵向继承体系重复性代码（性能监视、事务管理、安全检查、缓存）  
  
　　例如日志功能。日志代码往往横向地散布在所有对象层次中，而与它对应的对象的核心功能毫无关系对于其他类型的代码，如安全性、异常处理和透明的持续性也都是如此，这种散布在各处的无关的代码被称为横切（cross cutting），在OOP设计中，它导致了大量代码的重复，而不利于各个模块的重用。  
　　起初工程师通过继承抽取通用代码的方式（纵向拓展）解决代码冗余，但是软件开发复杂之后，工程师发现同样的功能代码在其他模块一样出现，导致代码混乱。而横向抽取机制很好的解决了这个问题。
## 什么Spring AOP
　　Spring AOP使用纯Java实现，不需要专门的编译过程和类加载器，在运行期通过代理方式向目标类织入增强代码  
　　AspecJ是一个基于Java语言的AOP框架，Spring2.0开始，Spring AOP引入对Aspect的支持，AspectJ扩展了Java语言，提供了一个专门的编译器，在编译时提供横向代码的织入  
　　Spring中AOP代理由Spring的IOC容器负责生成、管理，其依赖关系也由IOC容器负责管理。因此，AOP代理可以直接使用容器中的其它bean实例作为目标，这种关系可由IOC容器的依赖注入提供。Spring创建代理的规则为：
1. 默认使用Java动态代理来创建AOP代理，这样就可以为任何**接口实例**创建代理了
2. 当需要代理的**类**不是代理接口的时候，Spring会切换为使用CGLIB代理，也可强制使用CGLIB
3. 若目标对象实现了若干接口，spring使用JDK的java.lang.reflect.Proxy类代理  
若目标对象没有实现任何接口，spring使用CGLIB库生成目标对象的子类

## AOP术语
* Joinpoint(连接点):所谓连接点是指那些被拦截到的点。在spring中,这些点指的是方法,因为spring只支持方法类型的连接点.**（ 哪些方法可以被拦截 ）**
* Pointcut(切入点):所谓切入点是指我们要对哪些Joinpoint进行拦截的定义.**（ 对哪些Joinpoint进行拦截 ）**
* Advice(通知/增强):所谓通知是指拦截到Joinpoint之后所要做的事情就是通知.通知分为前置通知,后置通知,异常通知,最终通知,环绕通知(切面要完成的功能)**（ 增强的代码 ）**
* Introduction(引介):引介是一种特殊的通知在不修改类代码的前提下, Introduction可以在运行期为类动态地添加一些方法或Field.**（ 特殊的Advice 类级别的增强，在原由类上添加一个属性或方法，普通Advice是对方法的增强 ）**
* Target(目标对象):代理的目标对象**（ 被增强的对象 ）**
* Weaving(织入):是指把增强应用到目标对象来创建新的代理对象的过程.
	spring采用动态代理织入，而AspectJ采用编译期织入和类装在期织入
* Proxy（代理）:一个类被AOP织入增强后，就产生一个结果代理类
* Aspect(切面): 是切入点和通知（引介）的结合

## JDK动态代理
UserDao.java
````java
package cn.uhfun.web.bean;
public interface UserDao {
    public void update();
}
````

UserDaoImpl.java
````java
package cn.uhfun.web.bean;
public class UserDaoImpl implements UserDao {
    @Override
    public void update() {
        System.out.print("update()执行自身方法");
    }
}
````

JDKProxy.java
````java
package cn.uhfun.web.bean;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
public class JDKProxy implements InvocationHandler {
    private UserDao userDao;
    public JDKProxy(UserDao userDao){
        super();
        this.userDao = userDao;
    }
    public UserDao createProxy(){
        UserDao proxy = (UserDao) Proxy.newProxyInstance(userDao.getClass().getClassLoader(),
                userDao.getClass().getInterfaces(), this);
        return proxy;
    }
    //调用目标对象的任何一个方法都相当于调用invoke()
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        if("update".equals(method.getName())){
            System.out.print("JDK Proxy :我在调用update()。。。。。前。。。。");
        }
        return method.invoke(userDao, args);
    }
}
````

ProxyTest.java
````java
package cn.uhfun.web.bean;
import com.sun.tools.internal.xjc.reader.xmlschema.bindinfo.BIConversion;
import org.junit.Test;
public class ProxyTest {
    @Test
    public void test1(){
        UserDao userDao = new UserDaoImpl();
        UserDao userDaoProxy = new JDKProxy(userDao).createProxy();
        userDaoProxy.update();
    }
}
````

测试结果
````java
JDK Proxy :我在调用update()。。。。。前。。。。update()执行自身方法
````
***标记为 final 的方法，不能被代理，因为无法进行覆盖
 JDK 动态代理，是针对接口生成子类，接口中方法不能使用 final 修饰***


## 使用CGLIB生成代理

CGLibProxy
````java
package cn.uhfun.web.bean;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
public class JDKProxy implements InvocationHandler {
    private UserDao userDao;
    public JDKProxy(UserDao userDao){
        super();
        this.userDao = userDao;
    }
    public UserDao createProxy(){

        UserDao proxy = (UserDao) Proxy.newProxyInstance(userDao.getClass().getClassLoader(),
                userDao.getClass().getInterfaces(), this);
        return proxy;
    }
    //调用目标对象的任何一个方法都相当于调用invoke()
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        if("update".equals(method.getName())){
            System.out.print("JDK Proxy :我在调用update()。。。。。前。。。。");
        }
        return method.invoke(userDao, args);
    }
}
````

ProxyTest.java
````java
package cn.uhfun.web.bean;
import com.sun.tools.internal.xjc.reader.xmlschema.bindinfo.BIConversion;
import org.junit.Test;
public class ProxyTest {
    @Test
    public void test2(){
        UserDao userDao = new UserDaoImpl();
        UserDao userDaoProxy = new CGLibProxy(userDao).createProxy();
        userDaoProxy.update();
    }
}
````

测试结果
````java
CGLib Proxy :我在调用update()。。。。。前。。。。update()执行自身方法
````

***标记为 final 的方法，不能被代理，因为无法进行覆盖 CGLib 是针对目标类生产子类，因此类或方法 不能使 final 的***
## Spring AOP 实现
### 传统方法实现
#### AOP通知类型
Spring按照通知Advice在目标类方法的连接点位置，可以分为5类
* 前置通知 org.springframework.aop.MethodBeforeAdvice  
在目标方法执行前实施增强
* 后置通知 org.springframework.aop.AfterReturningAdvice  
在目标方法执行后实施增强
* 环绕通知 org.aopalliance.intercept.MethodInterceptor  
在目标方法执行前后实施增强
* 异常抛出通知 org.springframework.aop.ThrowsAdvice  
在方法抛出异常后实施增强
* 引介通知 org.springframework.aop.IntroductionInterceptor  
在目标类中添加一些新的方法和属性

#### AOP切面类型
* Advisor : 代表一般切面，Advice本身就是一个切面，对目标类所有方法进行拦截 **（不带切点的切面，对所有方法拦截）**
* PointcutAdvisor : 代表具有切点的切面，可以指定拦截目标类哪些方法 
* IntroductionAdvisor : 代表引介切面，针对引介通知而使用切面

#### Advisor切面（针对所有方法增强）
**以前置增强为例：**
##### 1、编写被代理对象

  UserDao.java
  ````java
  package cn.uhfun.web.bean;
  public interface UserDao {
      public void update();
      public void add();
  }
  ````
  UserDaoImpl.java
  ````java
package cn.uhfun.web.bean;
public class UserDaoImpl implements UserDao {
    @Override
    public void update() {
        System.out.println("执行自身方法update()");
    }
    @Override
    public void add() {
        System.out.println("执行自身方法add()");
    }
}

  ````
##### 2、编写增强代码  
MyBeforeAdvice.java
  ````java
  package cn.uhfun.web.bean;

  import org.springframework.aop.MethodBeforeAdvice;

  import java.lang.reflect.Method;

  public class MyBeforeAdvice implements MethodBeforeAdvice {
      @Override
      public void before(Method method, Object[] objects, Object o) throws Throwable {
          System.out.print("前置增强");
      }
  }
  ````
##### 3、配置生成代理
* 这种代理基于ProxyFactoryBean，底层自动选择JDK动态代理还是CGLib代理
* 属性：
	+ target : 代理的目标对象
	+ proxyInterfaces : 代理要实现的接口
	+ 如果多个接口可以使用以下格式赋值  

    ````xml
    <list>
    <value></value>
    ....
    </list>
    ````

	+ proxyTargetClass : 是否对类代理而不是接口，设置为true时，使用CGLib代理
	+ interceptorNames : 需要织入目标的Advice
	+ singleton : 返回代理是否为单实例，默认为单例
	+ optimize : 当设置为true时，强制使用CGLib
* 配置

````xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="
http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">
    <!--配置被代理对象（目标对象）-->
    <bean id="userDao" class="cn.uhfun.web.bean.UserDaoImpl"/>
    <!--配置增强-->
    <bean id="myBeforeAdvice" class="cn.uhfun.web.bean.MyBeforeAdvice"/>
    <!--Spring支持生成代理-->
    <bean id="userDapProxy" class="org.springframework.aop.framework.ProxyFactoryBean">
        <property name="target" ref="userDao"/>
        <!--针对类的代理-->
        <property name="proxyTargetClass" value="true"/>
        <!--或者针对接口的代理-->
        <!--<property name="proxyInterfaces" value="cn.uhfun.web.bean.UserDao"/>-->
        <property name="interceptorNames" value="myBeforeAdvice"/>
    </bean>
</beans>
````
    
##### 4、编写测试类

   ````java
package cn.uhfun.web.bean;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration( locations = "classpath:applicationContext.xml")
public class SpringTest {
    @Autowired
    @Qualifier("userDapProxy")
    private UserDao userDao;   
    @Test
    public void test(){
        userDao.update();
        userDao.add();
    }
}
   ````
##### 5、测试结果

   ````java
前置增强
执行自身方法update()
前置增强
执行自身方法add()
   ````
#### PointcutAdvisor切面（针对某些方法增强）
* 常用PointcutAdvisor 实现类：  
	+ DefaultPointcutAdvisor 最常用的切面类型，它可以通过任意 Pointcut 和 Advice  组合定义切面
	+ RegexpMethodPointcutAdvisor 构造正则表达式切点切面  
    
**以环绕增强为例**
##### 1、编写被代理对象  

	UserDao.java
  ````java
  package cn.uhfun.web.bean;
  public interface UserDao {
      public void update();
      public void add();
  }
  ````

  UserDaoImpl.java
  ````java
package cn.uhfun.web.bean;
public class UserDaoImpl implements UserDao {
    @Override
    public void update() {
        System.out.println("执行自身方法update()");
    }
    @Override
    public void add() {
        System.out.println("执行自身方法add()");
    }
}

  ````
##### 2、编写增强代码  

MyBeforeAdvice.java
  ````java
package cn.uhfun.web.bean;
import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;
public class MyAroundAdvice implements MethodInterceptor {
    @Override
    public Object invoke(MethodInvocation methodInvocation) throws Throwable {
        System.out.println("环绕前增强");
        Object result = methodInvocation.proceed();//执行目标对象的方法
        System.out.println("环绕后增强");
        return result;//返回null，不执行目标对象方法
    }
}
  ````
##### 3、配置生成代理
* 这种代理基于ProxyFactoryBean，底层自动选择JDK动态代理还是CGLib代理
* 配置

````xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="
http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">
    <!--配置被代理对象（目标对象）-->
    <bean id="userDao" class="cn.uhfun.web.bean.UserDaoImpl"/>
    <!--配置增强-->
    <bean id="myAroundAdvice" class="cn.uhfun.web.bean.MyAroundAdvice"/>
    <!--定义切点切面-->
    <bean id="myPointCutAdvisor" class="org.springframework.aop.support.RegexpMethodPointcutAdvisor">
        <!--定义表达式，规定拦截哪些方法进行增强-->
     	<!--
我们举几个例子用进一步认识正则表达式在配置匹配方法上的具体应用： 
    示例1：.*set.*表示所有类中的以set前缀的方法，如com.baobaotao.Waiter.setSalary()，Person.setName()等； 
    示例2：com.advisor.*表示com.advisor包下所有类的所有方法； 
    示例3：com.service.*Service.* 牢匹配com.service包下所有类名以Service结尾的类的所有方法。
如com.service.UserService.save(User user)、com.service.ForumService.update(Forum forum)等方法； 
    示例4：com.service.*.save.+	匹配com.service包中所有类中所以save为前缀的方法。
如匹配com.service.UserService类的saveUser()和saveLoginLog()方法，但不匹配该类中的save()方法。 
		-->
        <property name="pattern" value=".*add"/>
        <property name="advice" ref="myAroundAdvice"/>
    </bean>
    <!--Spring支持生成代理-->
    <bean id="userDapProxy" class="org.springframework.aop.framework.ProxyFactoryBean">
        <property name="target" ref="userDao"/>
        <!--针对类的代理-->
        <property name="proxyTargetClass" value="true"/>
        <!--针对接口的代理-->
        <!--<property name="proxyInterfaces" value="cn.uhfun.web.bean.UserDao"/>-->
        <property name="interceptorNames" value="myPointCutAdvisor"/>
    </bean>
</beans>
````
##### 4、编写测试类

````java
package cn.uhfun.web.bean;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration( locations = "classpath:applicationContext.xml")
public class SpringTest {
    @Autowired
    @Qualifier("userDapProxy")
    private UserDao userDao;   
    @Test
    public void test(){
        userDao.update();
        userDao.add();
    }
}
````
##### 5、测试结果

````java
执行自身方法update()
环绕前增强
执行自身方法add()
环绕后增强
````
#### 自动创建代理
基于**bean后处理器**（在类创建过程中完成增强）  
在Bean的生成过程中，就产生了代理对象，把代理对象返回，生成的Bean就是代理对象。  
解决方案：  
* BeanNameAutoProxyCreator 根据Bean名称创建代理 
* DefaultAdvisorAutoProxyCreator 根据Advisor本身包含信息创建代理
* AnnotationAwareAspectJAutoProxyCreator 基于Bean中的AspectJ 注解进行自动代理

##### BeanNameAutoProxyCreator（根据Bean名称创建代理 ）

````xml
<!--配置被代理对象（目标对象）-->
    <bean id="userDao" class="cn.uhfun.web.bean.UserDaoImpl"/>
    <!--配置增强-->
    <bean id="myAroundAdvice" class="cn.uhfun.web.bean.MyAroundAdvice"/>
    <bean id="myPointCutAdvisor" class="org.springframework.aop.support.RegexpMethodPointcutAdvisor">
        <!--定义表达式，规定拦截哪些方法进行增强-->
        <property name="pattern" value=".*add"/>
        <property name="advice" ref="myAroundAdvice"/>
    </bean>
    <!--自动创建代理-->
    <bean class="org.springframework.aop.framework.autoproxy.BeanNameAutoProxyCreator">
        <property name="beanNames" value="*Dao"/>
        <property name="interceptorNames" value="myPointCutAdvisor"/>
    </bean>
````
##### DefaultAdvisorAutoProxyCreator（根据Advisor本身包含信息创建代理）
````xml
  <bean id="userDao" class="cn.uhfun.web.bean.UserDaoImpl"/>
    <!--配置增强-->
    <bean id="myAroundAdvice" class="cn.uhfun.web.bean.MyAroundAdvice"/>
    <bean id="myPointCutAdvisor" class="org.springframework.aop.support.RegexpMethodPointcutAdvisor">
        <!--定义表达式，规定拦截哪些方法进行增强-->
        <property name="pattern" value=".*add"/>
        <property name="advice" ref="myAroundAdvice"/>
    </bean>
    <!--自动创建代理-->
    <bean class="org.springframework.aop.framework.autoproxy.DefaultAdvisorAutoProxyCreator"/>
````
### 基于AspectJ 实现
#### 什么是ASpectJ
　　AspectJ是一个面向切面的框架，它扩展了Java语言。AspectJ定义了AOP语法，所以它有一个专门的编译器用来生成遵守Java字节编码规范的Class文件。
* AspectJ是一个基于Java语言的AOP框架
* Spring2.0以后新增了对AspectJ切点表达式支持
* @AspectJ 是AspectJ1.5新增功能，通过JDK5注解技术，允许直接在Bean类中定义切面
* 新版本Spring框架，建议使用AspectJ方式来开发AOP

#### AspectJ表达式
语法：  
　　execution(<访问修饰符>?<返回类型><方法名>(<参数>)<异常>)  
例如  
* 匹配所有类public方法  
	+ execution(public * *(..))  
* 匹配指定包下所有类方法 
	+ execution(* cn.itcast.dao.*(..)) 不包含子包  
	+ execution(* cn.itcast.dao..*(..))  ..*表示包、子孙包下所有类  
* 匹配指定类所有方法   
	+ execution(* cn.itcast.service.UserService.*(..))  
* 匹配实现特定接口所有类方法   
	+ execution(* cn.itcast.dao.GenericDAO+.*(..))
* 匹配所有save开头的方法 
	+ execution(* save*(..))
    
#### AOP通知类型
* @Before 前置通知，相当于BeforeAdvice  
**可以在方法中传入JoinPoint对象，用来获得切点信息**
````java
@Before("execution(* cn.uhfun.web.bean.UserDao.add(..))")
    public void before(JoinPoint joinPoint){
        System.out.println("aspectj：前置增强");
    }
````
* @AfterReturning 后置通知，相当于AfterReturningAdvice  
**通过returning属性 可以定义方法返回值，作为参数**
````java
@AfterReturning(value = "execution(* cn.uhfun.web.bean.UserDao.add(..))", returning = "returnVal")
    public void afterReturning(JoinPoint joinPoint, Object returnVal){
        System.out.println("aspectj：后置增强");
    }
````
* @Around 环绕通知，相当于MethodInterceptor  
**around方法的返回值就是目标代理方法执行返回值参数为ProceedingJoinPoint   可以调用拦截目标方法执行**
````java
@Around("execution(* cn.uhfun.web.bean.UserDao.add(..))")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println("aspectj：前置通知");
        Object returnValue = joinPoint.proceed();
        System.out.println("aspectj：后置通知");
        return returnValue;
    }
````
* @AfterThrowing抛出通知，相当于ThrowAdvice
**通过设置throwing属性，可以设置发生异常对象参数**
````java
 @AfterThrowing(value = "execution(* cn.uhfun.web.bean.UserDao.add(..))",throwing = "ex")
    public void afterThrowing(Exception ex){
        System.out.print(ex.getMessage());//异常信息
    }
````
* @After 最终final通知，不管是否异常，该通知都会执行
**无论目标方法是否异常，都会执行**
````java
@After("execution(* cn.uhfun.web.bean.UserDao.add(..))")
    public void after(JoinPoint joinPoint){
        System.out.println("aspectj：无论目标方法是否异常，都会执行");
    }
````
* @DeclareParents 引介通知，相当于IntroductionInterceptor 

#### 基于注解开发
**以前置增强为例：**
##### 1、编写被代理类
UserDao.java
````java
package cn.uhfun.web.bean;
public interface UserDao {
    public void update();
    public void add();
}
````
UserDaoImpl.java
````java
package cn.uhfun.web.bean;
public class UserDaoImpl implements UserDao {
    @Override
    public void update() {
        System.out.println("执行自身方法update()");
    }
    @Override
    public void add() {
        System.out.println("执行自身方法add()");
    }
}
````
##### 2、编写增强代码及注解
MyAspect.java
````java
package cn.uhfun.web.bean;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
@Aspect
public class MyAspect {
    @Before("execution(* cn.uhfun.web.bean.UserDao.add(..))")
    public void before(JoinPoint joinPoint){
        System.out.println("aspectj： "+joinPoint+"前置增强");
    }
}
````
##### 3、配置生成代理
* 引入AOP命名空间和约束
* 开启AspectJ自动代理
* 添加Bean配置

````xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="
http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd
http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd">
   <!--开启自动生成代理 底层AnnotationAwareAspectJAutoProxyCreator 基于Bean中的AspectJ 注解进行自动代理-->
    <aop:aspectj-autoproxy />
    <!--配置被代理对象（目标对象）-->
    <bean id="userDao" class="cn.uhfun.web.bean.UserDaoImpl"/>
    <!--配置切面-->
    <bean id="myAspect" class="cn.uhfun.web.bean.MyAspect"/>
</beans>
````
##### 4、编写测试类
````java
package cn.uhfun.web.bean;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration( locations = "classpath:applicationContext.xml")
public class SpringTest {
    @Autowired
    @Qualifier("userDapProxy")
    private UserDao userDao;   
    @Test
    public void test(){
        userDao.update();
        userDao.add();
    }
}
````
##### 5、测试结果
````java
执行自身方法update()
aspectj： execution(void cn.uhfun.web.bean.UserDao.add())前置增强
执行自身方法add()
````

##### 通过@Pointcut为切点命名

- 在每个通知内定义切点，会造成工作量大，不易维护，对于重复的切点，可以使用@Poingcut进行定义 
- 切点方法：private void 无参数方法，方法名为切点名 
- 当通知多个切点时，可以使用 `||** 进行连接 

````java
package cn.uhfun.web.bean;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
@Aspect
public class MyAspect {
    @Pointcut(value = "execution(* cn.uhfun.web.bean.UserDao.add(..))")
    private void pointcut1(){}
    @Before("MyAspect.pointcut1()")
    public void before(JoinPoint joinPoint){
        System.out.println("aspectj：前置通知");
    }  
}
````

#### 基于XML开发
**以前置增强为例：**
##### 1、编写被代理类
UserDao.java
````java
package cn.uhfun.web.bean;
public interface UserDao {
    public void update();
    public void add();
}
````
UserDaoImpl.java
````java
package cn.uhfun.web.bean;
public class UserDaoImpl implements UserDao {
    @Override
    public void update() {
        System.out.println("执行自身方法update()");
    }
    @Override
    public void add() {
        System.out.println("执行自身方法add()");
    }
}
````
##### 2、编写增强代码
MyAspect.java
````java
package cn.uhfun.web.bean;
public class MyAspect {
    public void before(){
        System.out.println("aspectj：前置增强");
    }
}
````
##### 3、配置生成代理

````xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"       
    xmlns:aop="http://www.springframework.org/schema/aop"
    xsi:schemaLocation="
http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd">

<bean id="userDao" class="cn.uhfun.web.bean.UserDaoImpl"/>
    <!--定义切面-->
    <bean id="myAspect" class="cn.uhfun.web.bean.MyAspect"/>
    <aop:config>
        <!--定义切点-->
        <aop:pointcut id="myPointcut" expression="execution(* cn.uhfun.web.bean.UserDao.add(..))"/>
        <aop:aspect ref="myAspect">
            <aop:before method="before" pointcut-ref="myPointcut"/>
        </aop:aspect>
    </aop:config>
</beans>
````
##### 4、编写测试类

````java
package cn.uhfun.web.bean;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration( locations = "classpath:applicationContext.xml")
public class SpringTest {
    @Autowired
    @Qualifier("userDapProxy")
    private UserDao userDao;   
    @Test
    public void test(){
        userDao.update();
        userDao.add();
    }
}
````

##### 5、测试结果

````java
执行自身方法update()
aspectj：前置增强
执行自身方法add()
````

### ProxyFactoryBean类图
![ProxyFacotryBean类图](/images/ProxyFacotryBean类图.png)

### 基于ProxyFactoryBean和自动代理的区别？
- ProxyFactoryBean：先有被代理对象（目标对象），将被代理对象传入代理类中生成代理
- 自动代理：基于**Bean后处理器（ BeanPostProcessor ）**，在Bean的生成过程中，就产生了代理对象，把代理对象返回，所以生成的Bean就是代理对象。