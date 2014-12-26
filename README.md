simpleXrm
=========

Advantages:

-simple, declarative methods that allow fast & interactive form scripting
-flattened namespace which simplifies developer interface
-plural methods which iterate over each argument, allowing faster development and smaller libraries than interacting with each control or attribute individually
-compound methods for common tasks such as "closeAtt()" which will hide and lock a control as well as clear its value in memory
-reduced risk for SDK version upgrades w.r.t. deprecated methods (we can update or fork simpleXrm.js to support the new methods or apply a safe workaround for deprecated methods without forcing developers to update each and every one of their form libraries)
-(in progress) built in null safe & type safe checks
