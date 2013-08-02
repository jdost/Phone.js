describe("Phone.js", function () {
  // Test US number is (800) 221-5689 - a US gov't info line
  describe("Number validation", function () {
    it("Check US validation", function () {
      Phone.setDefaultFormat("US");
      expect(Phone.isValid("(800) 221-5689")).toBe(true);
      expect(Phone.isValid("221-5689")).toBe(true);
      expect(Phone.isValid("334 189")).not.toBe(true);
    });
    it("Check International validation", function () {
      Phone.setDefaultFormat("INTERNATIONAL");
      expect(Phone.isValid("123 4567")).toBe(true);
      expect(Phone.isValid("+56 123 456 7890")).toBe(true);
      expect(Phone.isValid("+ asdf 1234")).toBe(false);
    });
  });

  describe("Number parsing", function () {
    it("Parse basic US number", function () {
      var phone = Phone("221-5689");
      expect(phone.raw.length).toBe(7);
      expect(phone.raw).toEqual([2,2,1,5,6,8,9]);
    });
    it("Parse full US number", function () {
      var phone = Phone("(800) 221-5689");
      expect(phone.raw.length).toBe(10);
      expect(phone.raw).toEqual([8,0,0,2,2,1,5,6,8,9]);
    });
  });

  describe("Number formatting", function () {
    it("Format US number", function () {
      Phone.setDefaultFormat("US");
      var phone = Phone("(800) 221-5689");
      expect(phone.toString()).toBe("(800) 221-5689");
    });
    it("Format International number", function () {
      Phone.setDefaultFormat("INTERNATIONAL");
      var phone = Phone("(800) 221-5689");
      expect(phone.toString()).toBe("800 221 5689");
    });
  });

  it("Generate HTML markup", function () {
    Phone.setDefaultFormat("US");
    var phone = Phone("(800) 221-5689");
    expect(phone.toHTML()).toBe("<a href=\"tel:8002215689\">(800) 221-5689</a>");

    phone = Phone("221-5689");
    expect(phone.toHTML()).toBe("<a href=\"tel:2215689\">221-5689</a>");
  });
});
