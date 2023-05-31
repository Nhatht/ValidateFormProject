//rule validate (những yêu cầu để được công nhận)
//  Email: IsRequired, isEmail
//  Name: IsRequired, isName (có thể là tiếng việt, tiếng anh, max50)
//  Gender: IsRequired,
//  Country: IsRequired
//  Password: IsRequired, min8, max20
//  confirmedPassword: IsRequired, min8, max20, isSame(password)
//  agree: IsRequired

//mình phải viết regex cho email và name
const REG_EMAIL = /^[a-zA-Z\d\.\-\_]+(\+\d+)?@[a-zA-Z\d\.\-\_]{1,65}\.[a-zA-Z]{1,5}$/;
const REG_NAME = /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]+((\s[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]+)+)?$/;

//viết những hàm nhận vào value và kiểm tra value theo 1 tiêu chí gì đó
//  nếu value đó hợp lệ thì return "" | nếu value đó không hợp lệ thì return "Chửi"
const isRequired = (value) => (value !== "" ? "" : "That field is required");
const isEmail = (value) => REG_EMAIL.test(value) ? "" : "Email is not validate";
const isName = (value) => REG_NAME.test(value) ? "" : "Name is not validate";
//currying
const min = (num) => (value) => value.length >= num ? "" : `Min is ${num}`;
const max = (num) => (value) => value.length <= num ? "" : `Max is ${num}`;
const isSame = (paramValue, fieldName1, fieldName2) => (value) =>
    paramValue == value ? "" : `${fieldName1} không khớp ${fieldName2}`;
//value : giá trị của controlNode
//Funcs: mảng các hàm mà value cần check
//     vd:  value: email.value
//          funcs: [isRequired, isEmail]
//     vd:  value: name.value
//          funcs: [isRequired, isEmail, max(50)]
//ParentNode: là element cha của controlNode => để chèn câu chữi
//ControlNodes : các element dạng input

//hàm tạo thông báo chữi
const createMsg = (parentNode, controlNodes, msg) => {
    const invalidDiv = document.createElement("div");
    invalidDiv.className = "invalid-feedback";
    invalidDiv.textContent = msg;
    parentNode.appendChild(invalidDiv);
    controlNodes.forEach((inputItem) => {
        inputItem.classList.add("is-invalid");
    });
};

// viết 1 hàm nhận vào value nhận vào funcs, parentNode, ControlNodes
// nó sẽ gọi lần lượt các hàm trong funcs ra để kiểm tra value
//  nếu như quá trình kiểm tra trả ra chuỗi "chữi" thì ta
// sẽ sử dụng createMsg (parentNode, ControlNodes , "chữi" : msg)

const isValid = (paramObject) => {
    const {value, funcs, parentNode, controlNodes} = paramObject
    for (const funcCheck of funcs) {
        let msg = funcCheck(value);
        if(msg){
            createMsg(parentNode, controlNodes, msg);
            return msg;
        }
    }
    return "";
};
const clearMsg = () => {
    document.querySelectorAll(".is-invalid").forEach((inputNode) => {
        inputNode.classList.remove("is-invalid");
    });
    document.querySelectorAll(".invalid-feedback").forEach((divMsg) => {
        divMsg.remove();
    });
};
//sự kiện diễn ra
document.querySelector("form").addEventListener("submit", (event) =>{
    event.preventDefault();
    //xóa các thông báo lỗi
    clearMsg();
    //dom tới các controlNode
    const emailNode = document.querySelector("#email")
    const nameNode = document.querySelector("#name")
    const genderNode = document.querySelector("#gender")
    const countryNode = document.querySelector("input[name = 'country']:checked")
    const passwordNode = document.querySelector("#password")
    const confirmedPasswordNode = document.querySelector("#confirmedPassword")
    const agreeNode = document.querySelector("input#agree:checked")
    const errorMsg = [
        //email
        isValid({
            value: emailNode.value, 
            funcs: [isRequired, isEmail], 
            parentNode: emailNode.parentElement, 
            controlNodes: [emailNode],
        }),
        //name
        isValid({
            value: nameNode.value, 
            funcs: [isRequired, isName, max(50)], //max dùng currying
            parentNode: nameNode.parentElement, 
            controlNodes: [nameNode],
        }),
        //gender
        isValid({
            value: genderNode.value, 
            funcs: [isRequired], 
            parentNode: genderNode.parentElement, 
            controlNodes: [genderNode],
        }),
        //country
        isValid({
            value: countryNode ? countryNode.value : "", 
            funcs: [isRequired], 
            parentNode: document.querySelector(".form-check-country").parentElement, 
            controlNodes: document.querySelectorAll("input[name = 'country']"),
        }),
        //password
        isValid({
            value: passwordNode.value, 
            funcs: [isRequired, min(8), max(20)], 
            parentNode: passwordNode.parentElement, 
            controlNodes: [passwordNode],
        }),
        //confirmedPassword 
        isValid({
            value: confirmedPasswordNode.value, 
            funcs: [isRequired, min(8), max(20), isSame(passwordNode.value, "Password", "ConfirmedPassword")], 
            parentNode: confirmedPasswordNode.parentElement, 
            controlNodes: [confirmedPasswordNode],
        }),
        //agree
        isValid({
            value: agreeNode ? agreeNode.value : "", 
            funcs: [isRequired], 
            parentNode: document.querySelector("#agree").parentElement, 
            controlNodes: [document.querySelector("#agree")],
        }),
    ];
    let isValidForm = errorForm.every((item) => !item);
    if(isValidForm){
        alert("Form is valid");
        clearMsg();
    }
});