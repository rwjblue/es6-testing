class Person {
  constructor(options) {
    this.first = options.first;
    this.last = options.last;
    this.birthYear = options.birthYear;
  }

  @computed('birthYear')
  age(birthYear) {
    const currentYear = (new Date()).getYear() + 1900;

    return currentYear - birthYear;
  }

  @computed('first', 'last')
  get fullName(first, last)  {
    return `${first} ${last}`;
  }

  set fullName(value) {
    return value.split(' ')
  }
}

function computed(...params) {
  return function(target, key, descriptor) {
    function compute(func) {
      return function() {
        let paramValues = params.map(p => this[p]);

        return func.apply(this, paramValues);
      };
    }

    if (descriptor.writable) {
      descriptor.get = compute(descriptor.value);

      delete descriptor.writable;
      delete descriptor.value;
    } else {
      descriptor.get = compute(descriptor.get);
      descriptor.set = compute(descriptor.set);
    }

    return descriptor;
  };
}
