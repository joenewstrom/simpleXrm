simpleXrm
=========

Advantages:

 - Simple, declarative methods that allow fast & interactive form scripting
 - Flattened namespace which simplifies developer interface
 - Plural methods which iterate over each argument, allowing faster development and smaller libraries than interacting with each control or attribute individually
 - Compound methods for common tasks such as `closeAtt()` which will hide and lock a control as well as clear its value in memory
 - Reduced risk for SDK version upgrades w.r.t. deprecated methods *(we can update or fork simpleXrm.js to support the new method or apply a safe workaround for deprecated methods without forcing developers to update each and every one of their form  libraries)*
 - Built in null safe & type safe checks *(in progress)*
