# Aleo Documentation
limitations of the leo language
Skip to main content
Welcome to the Leo Docs
Playground
Explorer
Provable
Aleo

Welcome to the Leo Docs
Leo
What's new?
Where to go?
Getting Started
Language

Project Layout
Data Types
Programs In Practice
Private State
Public State
Functions
Control Flow
Limitations
Operators & Expressions

Best Practices
Leo Syntax Cheatsheet
CLI

Guides
Leo By Example
Resources

LanguagePrograms In PracticeLimitations
Limitations
snarkVM imposes the following limits on Aleo programs:

the maximum size of the program 100 KB, by the number of characters.
the maximum number of mappings is 31.
the maximum number of imports is 64.
the maximum import depth is 64.
the maximum call depth is 31.
the maximum number of functions is 31.
the maximum number of structs is 310.
the maximum number of records is 310.
the maximum number of closures is 62.
If your compiled Leo program exceeds these limits, then consider modularizing or rearchitecting your program. The only way these limits can be increased is through a formal protocol upgrade via the governance process defined by the Aleo Network Foundation.

Some other protocol-level limits to be aware of are:

the maximum transaction size is 128 KB. If your program exceeds this, perhaps by requiring large inputs or producing large outputs, consider optimizing the data types in your Leo code.
the maximum number of micro-credits your transaction can consume for on-chain execution is 100_000_000.. If your program exceeds this, consider optimizing on-chain components of your Leo code.
As with the above restructions. these limits can only be increased via the governance process.

Compiling Conditional On-Chain Code
Consider the following Leo transition.

transition weird_sub(a: u8, b: u8) -> u8 {
    if (a >= b) {
        return a.sub_wrapped(b);
    } else {
        return b.sub_wrapped(a);
    }
}

This is compiled into the following Aleo instructions:

function weird_sub:
    input r0 as u8.private;
    input r1 as u8.private;
    gte r0 r1 into r2;
    sub.w r0 r1 into r3;
    sub.w r1 r0 into r4;
    ternary r2 r3 r4 into r5;
    output r5 as u8.private;

Observe that both branches of the conditional are executed in the transition. The correct output is then selected using a ternary instruction. This compilation method is only possible because operations in transitions are purely functional. 1.

On-chain commands are not all purely functional; for example, get, get.or_use, contains, remove, and set, whose semantics all depend on the state of the program. As a result, the same technique for off-chain code cannot be used. Instead, the on-chain code is compiled using branch and position commands, which allow the program to define sequences of code that are skipped. However, because destination registers in skipped instructions are not initialized, they cannot be accessed in a following instructions. In other words, depending on the branch taken, some registers are invalid and an attempt to access them will return in an execution error. The only Leo code pattern that produces such an access attempt is code that attempts to assign out to a parent scope from a conditional statement; consequently, they are disallowed.

This restriction can be mitigated by future improvements to snarkVM, however we table that discussion for later.




Aleo instructions and snarkVM
Welcome to the Aleo instructions guide. Aleo instructions is the intermediate representation of Aleo programs. All Leo programs compile to Aleo instructions which compile to bytecode. We recommend learning and using Aleo instructions if your goal is fine-grained circuit design or if you are implementing a compiler that reads in a high-level language other than Leo and want your programs to run on Aleo.

Aleo programs are files with a .aleo extension. Aleo programs contain Aleo instructions - an assembly-like programming language. Aleo instructions are compiled into AVM opcodes that can be executed by the Aleo Virtual Machine.

Install snarkVM to compile and execute Aleo instructions.

info
snarkVM is currently in active development. Please monitor the repository on GitHub for possibly breaking changes.

Installing snarkVM
Proceed to Installation for information on how to install snarkVM.

Hello Aleo Instructions
Develop your first Hello Aleo Aleo instructions program.

Aleo Instructions Guide
Learn the core concepts and syntax of Aleo instructions.

Read the full list of supported AVM opcodes.

Formal Language Documentation
Check your program or compiler implementation against the Aleo instructions grammar.

Study the formal ABNF grammar specification for the full formal syntax of Aleo instructions.

Additional Material
Install Aleo instructions for your favorite code editor.

Edit this page


Skip to main content
Aleo
Aleo Developer
Concepts
Guides
Leo Language
Leo Playground
SDK
API Endpoints
Aleo.org
Introduction

Getting Started
Quick Start
Installation
Aleo Instructions

Overview
Installation
Hello Aleo
Language
Opcodes
Special Operands
Grammar
Tooling
Program Upgrades
Standard Programs

Token Registry
NFT Standards
Aleo Name Service
Solidity to Leo

FAQs
How to Get Help
Contribute

Aleo InstructionsInstallation
Installation
1. Install the Prerequisites
1.1 Install Git:
bit.ly/start-git

1.2 Install Rust:
bit.ly/start-rust

1.3 Check the Prerequisites
git --version
cargo --version

2. Build Source Code
You can install snarkVM by building from the source code as follows:

# Download the source code
git clone https://github.com/AleoNet/snarkVM
cd snarkvm

# Build in release mode
$ cargo install --path .

This will generate the executable ~/.cargo/bin/snarkvm.

Now to use the snarkVM CLI, in your terminal, run:

snarkvm

info
Dive into some code with Hello Aleo.

Edit this page
Last updated on Oct 14, 2024 by zklimaleo
Previous
Overview
Next
Hello Aleo
1. Install the Prerequisites
1.1 Install Git:
1.2 Install Rust:
1.3 Check the Prerequisites
2. Build Source Code
Learn
Getting Started
Core Concepts
Blogs
Press
Contribute
Contribution Guidelines
SnarkOS Contribute
SnarkVM Contribute
Documentation Contribute
Community
Chat on Discord
@AleoHQ on Twitter
Youtube
Governance
Company
About Aleo
Brand Assets
Opportunities
Copyright © 2026 Aleo Network Foundation
x1.00



Skip to main content
Aleo
Aleo Developer
Concepts
Guides
Leo Language
Leo Playground
SDK
API Endpoints
Aleo.org
Introduction

Getting Started
Quick Start
Installation
Aleo Instructions

Overview
Installation
Hello Aleo
Language
Opcodes
Special Operands
Grammar
Tooling
Program Upgrades
Standard Programs

Token Registry
NFT Standards
Aleo Name Service
Solidity to Leo

FAQs
How to Get Help
Contribute

Aleo InstructionsHello Aleo
Hello Aleo Instructions
1. Create and build a new project
To create a new project, we'll use the new command. Our project:

snarkvm new foo

This will create foo directory and the files with the basic structure of the project:

README.md having the skeleton of a README with instructions on how to compile.
main.aleo the main file of the source code.
program.json containing the identification of the project in JSON format. Particularly, a dev address and its private key for the program.
The main.aleo file should have contents like this:

// The 'foo.aleo' program.
program foo.aleo;

function hello:
    input r0 as u32.public;
    input r1 as u32.private;
    add r0 r1 into r2;
    output r2 as u32.private;


You can run a program with the snarkvm run command, followed by the function name you want to run and its input parameters:

snarkvm run hello 2u32 3u32

You will see output like this:

 • Loaded universal setup (in 1478 ms)

⛓  Constraints

 •  'foo.aleo/hello' - 33 constraints (called 1 time)

➡️  Output

 • 5u32

✅ Finished 'foo.aleo/hello' (in "/Users/collin/code/snarkVM/foo")

As you can see, the output has the 5u32 value, representing the sum of the inputs.

2. Executing a program
You can execute a program with the snarkvm execute command, followed by the function name you want to execute and its input parameters:

snarkvm execute hello 2u32 3u32

When the execution is finished, you should see the following output:

 • Loaded universal setup (in 1478 ms)

⛓  Constraints

 •  'foo.aleo/hello' - 33 constraints (called 1 time)

➡️  Output

 • 5u32
 
  {"type":"execute","id":"at1 ... (transaction object truncated for brevity)

✅ Executed 'foo.aleo/hello' (in "/Users/collin/code/snarkVM/foo")

As you can see, the output has the 5u32 value, representing the sum of the inputs.

A "universal setup" is loaded into your environment. You can read more about this in the Marlin paper.

Once the universal setup is ready, every function in your main.aleo file is built, generating this in the output folder:

hello.prover the prover for the hello function.
hello.verifier the verifier for the hello function.
main.avm the bytecode of your aleo program to be run by the VM.
As you can already guess, we have only one .avm file for the whole program, but a prover and verifier for every function.

3. Overview of a program
Let's examine the foo program inside the main.aleo file:

// The 'foo.aleo' program.
program foo.aleo;

function hello:
    input r0 as u32.public;
    input r1 as u32.private;
    add r0 r1 into r2;
    output r2 as u32.private;


First, we need to declare the program as the following:

program foo.aleo;

Afterwards, we can start writing its functions (or other Aleo structures such as structs, records, closures, as we will see later).

In the case of functions we have it very easy:

function [function_name]:

The functions are composed of three main parts:

The input section

Here we declare its input parameters:

    input r0 as u32.public;
    input r1 as u32.private;

Everything in Aleo instructions are declared/stored inside a register with a type (i8,field,bool, etc.) and a visibility option (public or private), registers are named as r0, r1, ..., rn.

In this case we use r0 and r1 to store the inputs passed in sequential order to a program as u32 values, where we can store 32-bit unsigned integers to perform our sum operation.

The instructions section

The next section consists of the core of our function: here we call the Aleo Instructions we need to make our program do what we want. For example, performing an addition operation:

    add r0 r1 into r2;

Every aleo instruction is followed by its input parameters with its specific types, and the result is stored in the register specified after into.

You can find all the available Aleo instruction opcodes here.

The output section

Similar to the input section, the output section does the same for the output of the program. It's the return of the function.

    output r2 as u32.private;

4. Types
Aleo uses a strongly-typed syntax. The language supports 16 primitive types, and allows users to define custom types.

The Aleo primitive types include:

address
boolean
field
group
i8
i16
i32
i64
i128
u8
u16
u32
u64
u128
scalar

Users can define custom types using the struct or record keywords. We will explore these in the next few sections.

4.1 Registers
Registers are the places where you store data to then be able to modify it.

4.2 Structs
Structs are user-defined data structures. They are very much like traditional structs in conventional programming languages. You can store structs into registers, like with any other Aleo data types.

For example, let's build a struct representing a fixed-size array of 3 elements. Add this at the bottom of the main.aleo file:

struct array3:
    a0 as u32;
    a1 as u32;
    a2 as u32;


Now, just for example purposes, let's code a function that adds one to each element of a register with an array3 data type stored in it.

function sum_one_to_array3:
    input r0 as array3.private;
    add r0.a0 1u32 into r1;
    add r0.a1 1u32 into r2;
    add r0.a2 1u32 into r3;
    cast r1 r2 r3 into r4 as array3;
    output r4 as array3.private;


As you can see, we can input a struct into register r0 and access struct elements with the . syntax. We perform the add instruction on every element, storing the results in registers r1, r2 and r3 and, finally, we make use of the cast command to create a new array3 struct into r4.

Now, let's run it. In this case, the only new thing you need to know is that structs are passed to the cli in the following format:

"{a0: 1u32, a1: 2u32, a2: 3u32}"

Now we can execute the snarkvm run command. We will clean the project to pick up the new code:

snarkvm clean && snarkvm run sum_one_to_array3 "{a0: 0u32, a1: 1u32, a2: 2u32}"

And we get the new array3 element as output:

➡️  Output
 • {
  a0: 1u32,
  a1: 2u32,
  a2: 3u32
}
✅ Executed 'foo.aleo/sum_one_to_array3' (in "[...]/foo")

4.3 Records
A record is a fundamental data structure for encoding user assets and application state. Records are very similar to structs, but they have one required component:

record token:
    owner as address.private


The owner refers to the Aleo address that owns the record.

Records are important because they represent the basic Aleo structure to handle state in your application.

When running an Aleo function, only registers that belong to the application address can be passed as input registers. Otherwise, an error is raised and the application doesn't run.

You can find your development application address inside the .env file:

{
    NETWORK=testnet
    PRIVATE_KEY=APrivateKey1zkpFsQNXJwdvjKs9bRsM91KcwJW1gW4CDtF3FJbgVBAvPds
}

4.4 Aleo State
In Aleo, the state of an application is managed through records. An Aleo account can create a transaction to consume a record and produce a new record in its place. Records in Aleo are encrypted to the record owner address, ensuring that all records in Aleo are fully private.

5. Your first Aleo Program: Making a transfer
Consider this program:

// The 'foo.aleo' program.
program foo.aleo;

record token:
    owner as address.private;
    amount as u64.private;

function mint:
    input r0 as u64.private;
    cast self.signer r0 into r1 as token.record;
    output r1 as token.record;

function transfer_amount:
    //  sender token record
    input r0 as token.record;
    // receiver address
    input r1 as address.private;
    // amount to transfer
    input r2 as u64.private;
    // final balance of sender
    sub r0.amount r2 into r3;
    // final balance of receiver
    add 0u64 r2 into r4;
    // sender token record after the transfer
    cast r0.owner r3 into r5 as token.record;
    // receiver token record after the transfer
    cast r1 r4 into r6 as token.record;
    // sender new token record
    output r5 as token.record;
    // receiver new token record
    output r6 as token.record;


First, we define our own record data type called token, that has the required parameter owner and a user-defined parameter called amount, representing the amount of tokens we have.

This transfer_amount function receives 3 input parameters (sender record, receiver record and amount) and stores them in 3 registers (r0, r1 and r2). After that, it computes the final balance for both of them and stores it in r3 and r4 (using sub and add instructions to compute the subtraction and addition respectively). With those final amounts, it creates the output records for sender and receiver, storing them in r5 and r6. Finally, both records are sent out of the function with the output instruction.

To run this function, the first parameter is the input record of the program. The format of this parameter is the same as for struct types:

{
  owner: aleo1x5nz5u4j50w482t5xtqc3jdwly9s8saaxlgjz0wvmuzmxv2l5q9qmypx09.private,
  amount: 50u64.private
}

Where:

owner: the public address of the program, as found in the PRIVATE_KEY of the .env file.
other parameters: depending on the program itself (in this example, we used the parameter amount with the value 50).
Let's run the transfer_amount function (if you are following along, remember to use the address found in the program.json for the owner field):

snarkvm clean && snarkvm run transfer_amount "{
owner: aleo1x5nz5u4j50w482t5xtqc3jdwly9s8saaxlgjz0wvmuzmxv2l5q9qmypx09.private,
amount: 50u64.private,
_nonce: 0group.public
}" aleo1h3gu7fky36y8r7v2x9phc434fgf20g8qd7c7u45v269jfw6vmugqjegcvp 10u64

We get the following output records:


⛓  Constraints

 •  'foo.aleo/transfer_amount' - 4,172 constraints (called 1 time)
 
➡️  Outputs
 • {
  owner: aleo1x5nz5u4j50w482t5xtqc3jdwly9s8saaxlgjz0wvmuzmxv2l5q9qmypx09.private,
  amount: 40u64.private
  _nonce: 2293253577170800572742339369209137467208538700597121244293392265726446806023group.public
}
 • {
  owner: aleo1h3gu7fky36y8r7v2x9phc434fgf20g8qd7c7u45v269jfw6vmugqjegcvp.private,
  amount: 10u64.private
  _nonce: 2323253577170856894742339369235137467208538700597121244293392765726742543235group.public
}
✅ Finished 'foo.aleo/transfer_amount' (in "[...]/foo")


And that's it. You have transferred your first owner-defined tokens in Aleo!

Note: the _nonce is not written in Aleo instructions. The compiler outputs the _nonce in record outputs. The user needs to provide it as input when using a record.

Edit this page
Last updated on Oct 14, 2024 by zklimaleo
Previous
Installation
Next
Language
1. Create and build a new project
2. Executing a program
3. Overview of a program
4. Types
4.1 Registers
4.2 Structs
4.3 Records
4.4 Aleo State
5. Your first Aleo Program: Making a transfer
Learn
Getting Started
Core Concepts
Blogs
Press
Contribute
Contribution Guidelines
SnarkOS Contribute
SnarkVM Contribute
Documentation Contribute
Community
Chat on Discord
@AleoHQ on Twitter
Youtube
Governance
Company
About Aleo
Brand Assets
Opportunities
Copyright © 2026 Aleo Network Foundation
x1.00Skip to main content
Aleo
Aleo Developer
Concepts
Guides
Leo Language
Leo Playground
SDK
API Endpoints
Aleo.org
Introduction

Getting Started
Quick Start
Installation
Aleo Instructions

Overview
Installation
Hello Aleo
Language
Opcodes
Special Operands
Grammar
Tooling
Program Upgrades
Standard Programs

Token Registry
NFT Standards
Aleo Name Service
Solidity to Leo

FAQs
How to Get Help
Contribute

Aleo InstructionsLanguage
Aleo Instructions Language Guide
Statically Typed
Aleo instructions is a statically typed language, which means we must know the type of each variable before executing a circuit.

Explicit Types Required
There is no undefined or null value in Aleo instructions. When assigning a new variable, the type of the value must be explicitly stated.

Pass by Value
Expressions in Aleo instructions are always passed by value, which means their values are always copied when they are used as function inputs or in right sides of assignments.

Register based
There are no variable names in Aleo instructions. All variables are stored in registers denoted rX where X is a non-negative whole number starting from 0 r0, r1, r2, etc..

Data Types and Values
Booleans
Aleo instructions supports the traditional true or false boolean values. The explicit boolean type for booleans in statements is required.

function main:
    input r0: boolean.private;

Integers
Aleo instructions supports signed integer types i8, i16, i32, i64, i128 and unsigned integer types u8, u16, u32, u64, u128.

function main:
    input r0: u8.public;

info
Higher bit length integers generate more constraints in the circuit, which can slow down computation time.

Field Elements
Aleo instructions supports the field type for elements of the base field of the elliptic curve. These are unsigned integers less than the modulus of the base field, so the largest field element is 8444461749428370424248824938781546531375899335154063827935233455917409239040field.

function main:
    input r0: field.private;

Group Elements
The set of affine points on the elliptic curve passed into the Aleo instructions compiler forms a group. The curve is a Twisted Edwards curve with a = -1 and d = 3021. Aleo instructions supports a subgroup of the group, generated by a generator point, as a primitive data type. A group element is denoted by the x-coordinate of its point; for example, 2group means the point (2, 5553594316923449299484601589326170487897520766531075014687114064346375156608). The generator point is 1540945439182663264862696551825005342995406165131907382295858612069623286213group.

function main:
    input r0: group.private;

Scalar Elements
Aleo instructions supports the scalar type for elements of the scalar field defined by the elliptic curve subgroup. These are unsigned integers less than the modulus of the scalar field, so the largest scalar is 2111115437357092606062206234695386632838870926408408195193685246394721360382scalar.

function main:
    input r0: scalar.private;

Addresses
Addresses are defined to enable compiler-optimized routines for parsing and operating over addresses.

function main:
    input r0: address.private;

Signatures
Aleo uses a Schnorr signatures scheme to sign messages with an Aleo private key. Signatures can be verified in Aleo instructions using the sign.verify instruction.

sign.verify sign069ju4e8s66unu25celqycvsv3k9chdyz4n4sy62tx6wxj0u25vqp58hgu9hwyqc63qzxvjwesf2wz0krcvvw9kd9x0rsk4lwqn2acqhp9v0pdkhx6gvkanuuwratqmxa3du7l43c05253hhed9eg6ppzzfnjt06fpzp6msekdjxd36smjltndmxjndvv9x2uecsgngcwsc2qkns4afd r1 r2 into r3;


Layout of an Aleo Program
An Aleo program contains declarations of a Program ID, Imports, Functions, Closures, Structs, Records, Mappings, and Finalize. Ordering is only enforced for imports which must be at the top of file. Declarations are locally accessible within a program file. If you need a declaration from another program file, you must import it.

Program ID
A program ID is declared as {name}.{network}. The first character of a name must be lowercase. name can contain lowercase letters, numbers, and underscores. Currently, aleo is the only supported network domain.

program hello.aleo; // valid

program Foo.aleo;   // invalid
program baR.aleo;   // invalid
program 0foo.aleo;  // invalid
program 0_foo.aleo; // invalid
program _foo.aleo;  // invalid


Import
An import is declared as import {ProgramID};.
Imports fetch other declarations by their program ID and bring them into the current file scope. You can import dependencies that are downloaded to the imports directory.

import foo.aleo; // Import the `foo.aleo` program into the `hello.aleo` program.

program hello.aleo;


Function
A function is declared as function {name}:.
Functions contain instructions that can compute values. Functions must be in a program's current scope to be called.

function foo:
    input r0 as field.public;
    input r1 as field.private;
    add r0 r1 into r2;
    output r2 as field.private;


Function Inputs
A function input is declared as input {register} as {type}.{visibility};.
Function inputs must be declared just after the function name declaration.

// The function `foo` takes a single input `r0` with type `field` and visibility `public`.
function foo:
    input r0 as field.public;


Function Outputs
A function output is declared as output {register} as {type}.{visibility};.
Function outputs must be declared at the end of the function definition.

...
    output r0 as field.public;


Call a Function
In the Aleo protocol, calling a function creates a transition that can consume and produce records on-chain. Use the aleo run CLI command to pass inputs to a function and execute the program.
In Testnet, program functions cannot call other internal program functions. If you would like to develop "helper functions" that are called internally within a program, try writing a closure.

Call an Imported Function
Aleo programs can externally call other Aleo programs using the call {program}/{function} {register} into {register} instruction.

import foo.aleo;

program bar.aleo;

function call_external:
    input r0 as u64.private;
    call foo.aleo/baz r0 into r1; // Externally call function `baz` in foo.aleo with argument `r0` and store the result in `r1`.
    output r1 as u64.private;


Closure
A closure is declared as closure {name}:.
Closures contain instructions that can compute values. Closures are helper functions that cannot be executed directly. Closures may be called by other functions.

closure foo:
    input r0 as field;
    input r1 as field;
    add r0 r1 into r2;
    output r2 as field;


Call a Closure
Aleo programs can internally call other Aleo closures using the call {name} {register} into {register} instruction.

program bar.aleo;

function call_internal:
    input r0 as u64.private;
    call foo r0 into r1; // Internally call closure `foo` with argument `r0` and store the result in `r1`.
    output r1 as u64.private;


Struct
A struct is a data type declared as struct {name}:.
Structs contain component declarations {name} as {type}.

struct array3:
    a0 as u32;
    a1 as u32;
    a2 as u32;


To instantiate a struct in a program use the cast instruction.

function new_array3:
    input r0 as u32.private;
    input r1 as u32.private;
    input r2 as u32.private;
    cast r0 r1 r2 into r3 as array3;
    output r3 as array3.private;


Array
An array literal is written as [{value}, {value}, ..], where all the values are the same type. For example,

[true, false, true]

The type of an array includes the type of the elements and the length of the array [{type}; {length}]. The type of this example is

[boolean; 3u32]

Arrays can be initialized using the cast opcode.

function new_array:
    input r0 as boolean.private;
    input r1 as boolean.private;
    input r2 as boolean.private;
    cast r0 r1 r2 into r3 as [boolean; 3u32];
    output r3 as [boolean; 3u32].private;


Arrays can be indexed using {name}[{index}].

function get_array_element:
    input r0 as [boolean; 4u32].public;
    input r1 as u32.public;
    r0[r1] into r2;
    output r2 as boolean.public;


Arrays can be nested.

[[true, false, true, false], [false, true, false, true]]

function get_nested_array_element:
    input r0 as [[boolean; 4u32]; 2u32].public;
    r0[0u32][1u32] into r1;
    output r1 as boolean.public;


info
Aleo instructions currently only support fixed-length static arrays.

Record
A record type is declared as record {name}:.
Records contain component declarations {name} as {type}.{visibility};.
Record data structures must contain the owner declaration as shown below.
When passing a record as input to a program function the _nonce as group.{visibility} declaration is also required.

record token:
    // The token owner.
    owner as address.private;
    // The token amount.
    amount as u64.private;


To instantiate a record in a program use the cast instruction.

function new_token:
    input r0 as address.private;
    input r1 as u64.private;
    input r2 as u64.private;
    cast r0 r1 r2 into r3 as token.record;
    output r3 as token.record;


Special Operands
self.signer
The self.signer operand returns the user address that originated the transition.
This is particularly useful in intermediate programs that need to modify the state of the original caller rather than their own state.

In the example below, the transfer_public_as_signer function uses self.signer to decrement the balance from the original user's account rather than from the intermediate program's account.

// The `transfer_public_as_signer` function sends the specified amount
// from the signer's `account` to the receiver's `account`.
function transfer_public_as_signer:
    // Input the receiver.
    input r0 as address.public;
    // Input the amount.
    input r1 as u64.public;
    // Transfer the credits publicly.
    async transfer_public_as_signer self.signer r0 r1 into r2;
    // Output the finalize future.
    output r2 as credits.aleo/transfer_public_as_signer.future;

finalize transfer_public_as_signer:
    // Input the signer.
    input r0 as address.public;
    // Input the receiver.
    input r1 as address.public;
    // Input the amount.
    input r2 as u64.public;
    // Decrements `account[r0]` by `r2`.
    // If `account[r0] - r2` underflows, `transfer_public_as_signer` is reverted.
    get account[r0] into r3;
    sub r3 r2 into r4;
    set r4 into account[r0];
    // Increments `account[r1]` by `r2`.
    // If `account[r1]` does not exist, 0u64 is used.
    // If `account[r1] + r2` overflows, `transfer_public_as_signer` is reverted.
    get.or_use account[r1] 0u64 into r5;
    add r5 r2 into r6;
    set r6 into account[r1];


self.caller
The self.caller operand returns the address of the immediate caller of the program.

Mapping
A mapping is declared as mapping {name}:. Mappings contain key-value pairs and must be defined within a program.
Mappings are stored publicly on-chain. It is not possible to store data privately in a mapping.

// On-chain storage of an `account` map, with `owner` as the key,
// and `amount` as the value.
mapping account:
    // The token owner.
    key as address.public;
    // The token amount.
    value as u64.public;


Contains
A contains command that checks if a key exists in a mapping, e.g. contains accounts[r0] into r1;.

Get
A get command that retrieves a value from a mapping, e.g. get accounts[r0] into r1;.

Get or Use
A get command that uses the provided default in case of failure, e.g. get.or_use account[r1] 0u64 into r5;.

// The `transfer_public` function sends the specified amount
// from the caller's `account` to the receiver's `account`.
function transfer_public:
    // Input the receiver.
    input r0 as address.public;
    // Input the amount.
    input r1 as u64.public;
    // Transfer the credits publicly.
    async transfer_public self.caller r0 r1 into r2;
    // Output the finalize future.
    output r2 as credits.aleo/transfer_public.future;

finalize transfer_public:
    // Input the caller.
    input r0 as address.public;
    // Input the receiver.
    input r1 as address.public;
    // Input the amount.
    input r2 as u64.public;
    // Decrements `account[r0]` by `r2`.
    // If `account[r0] - r2` underflows, `transfer_public` is reverted.
    get account[r0] into r3;
    sub r3 r2 into r4;
    set r4 into account[r0];
    // Increments `account[r1]` by `r2`.
    // If `account[r1]` does not exist, 0u64 is used.
    // If `account[r1] + r2` overflows, `transfer_public` is reverted.
    get.or_use account[r1] 0u64 into r5;
    add r5 r2 into r6;
    set r6 into account[r1];


Set
A set command that sets a value in a mapping, e.g. set r0 into accounts[r0];.

Remove
A remove command that removes a key-value pair from a mapping, e.g. remove accounts[r0];.

Reading external program's mapping value
A program can also read an external program's mapping value. This enables your program to access and utilize data maintained by another program, making composability possible. e.g.:

// Import the external program whose mapping you want to read.
import credits.aleo;
program another_program.aleo;

function main:
    async main into r0;
    output r0 as another_program.aleo/main.future;

finalize main:
    // Read value from 'account' mapping in the external 'credits.aleo' program for the specified key.
    get credits.aleo/account[aleo1...] into r0;
    // Read value from 'account' mapping in the external 'credits.aleo' program for the specified key,
    // or use the default value 0u64 if the mapping does not exist.
    get.or_use credits.aleo/account[aleo1...] 0u64 into r1;


Finalize
A finalize is declared as finalize {name}:.
A finalize must immediately follow a function, and must have the same name;

// The `transfer_public_to_private` function turns a specified amount
// from the mapping `account` into a record for the specified receiver.
//
// This function publicly reveals the sender, the receiver, and the specified amount.
// However, subsequent methods using the receiver's record can preserve the receiver's privacy.
function transfer_public_to_private:
    // Input the receiver.
    input r0 as address.private;
    // Input the amount.
    input r1 as u64.public;
    // Construct a record for the receiver.
    cast r0 r1 into r2 as credits.record;
    // Decrement the balance of the sender publicly.
    async transfer_public_to_private self.caller r1 into r3;
    // Output the record of the receiver.
    output r2 as credits.record;
    // Output the finalize future.
    output r3 as credits.aleo/transfer_public_to_private.future;

finalize transfer_public_to_private:
    // Input the sender.
    input r0 as address.public;
    // Input the amount.
    input r1 as u64.public;
    // Retrieve the balance of the sender.
    get account[r0] into r2;
    // Decrements `account[r0]` by `r1`.
    // If `r2 - r1` underflows, `transfer_public_to_private` is reverted.
    sub r2 r1 into r3;
    // Updates the balance of the sender.
    set r3 into account[r0];


note
A finalize function is executed on chain after the zero-knowledge proof of the execution of the associated function is verified. If the finalize function succeeds, the program logic is executed.
If the finalize function fails, the program logic is reverted.

Futures
A future is equivalent to the call graph of the on-chain execution and is explicitly used when finalizing an execution. Instead of constructing the call graph implicitly from the code, the transition/circuit explicitly outputs a future, specifying which code blocks to run on-chain and how to run them.

future type
A user can declare a future type by specifying a Locator followed by the tag .future. For example, credits.aleo/mint_public.future. A function can only output a future and a finalize block can only take a future in as input. A closure cannot output a future or take a future in as input.

async call
A user can make an asynchronous call to the finalize block via the async keyword. For example, async mint_public r0 r1 into r2;. Note that the associated function must be specified. This operation produces a Future as output. async takes the place of the finalize command, which was allowed in the body of a function after the output statements.

await command
A user can evaluate a future inside of a finalize block using the await command. For example, await r0;. An await command can only be used in a finalize block. The operand must be a register containing a Future.

Indexing a future.
A register containing a future can be indexed using the existing index syntax. For example, r0[0u32]. This would get the input of the future at that specific index. Accesses can be nested to match the nested structure of a future.

Future example
program basic_math.aleo;

mapping uses:
    key user as address.public;
    value count as i64.public;

function add_and_count:
    input r0 as i64.private;
    input r1 as i64.private;
    add r0 r1 into r2;
    async add_and_count self.caller into r3;
    output r2 as i64.private;
    output r3 as basic_math.aleo/add_and_count.future;

finalize add_and_count:
    input r0 as address.public;
    get.or_use uses[r0] 0i64 into r1;
    add r1 1i64 into r2;
    set r2 into uses[r0];

function sub_and_count:
    input r0 as i64.private;
    input r1 as i64.private;
    sub r0 r1 into r2;
    async sub_and_count self.caller into r3;
    output r2 as i64.private;
    output r3 as basic_math.aleo/sub_and_count.future;

finalize sub_and_count:
    input r0 as address.public;
    get.or_use uses[r0] 0i64 into r1;
    add r1 1i64 into r2;
    set r2 into uses[r0];

/////////////////////////////////////////////////

import basic_math.aleo;

program count_usages.aleo;

function add_and_subtract:
    input r0 as i64.private;
    input r1 as i64.private;
    call basic_math.aleo/add_and_count r0 r1 into r2 r3;
    call basic_math.aleo/sub_and_count r2 r1 into r4 r5;
    assert.eq r0 r4;
    assert.eq r3[0u32] r5[0u32];
    async add_and_subtract r3 r5 into r6;
    output r0 as i64.private;
    output r6 as count_usages.aleo/add_and_subtract.future;

finalize add_and_subtract:
    input r0 as basic_math.aleo/add_and_count.future;
    input r1 as basic_math.aleo/sub_and_count.future;
    await r0;
    assert.eq r0[0u32] r1[0u32];
    await r1;


There are a number of rules associated with using these components.

If a function has a finalize block, it must have exactly one async instruction.
If a function has a finalize block, it's last output must be a future.
If a function does not have a finalize block, it cannot have an async instruction`.
All futures created by calls need to be input to the async instruction in the order they were produced.
An async call must reference the same function.
All calls must be made before invoking async.
The input futures types in a finalize block must match the order in which they were created in the function.
All futures in a finalize must be await-ed and in the order in which they were specified.
Instructions can be interleaved between invocations of call, async, and await.
Finalize Commands
The following commands are supported in Aleo Instructions to provide additional program functionality.

block.height
The block.height command returns the height of the block in which the program is executed (latest block height + 1).
This can be useful for managing time-based access control to a program.
The block.height command must be called within a finalize block.

assert.eq block.height 100u64;

block.timestamp
The block.timestamp command returns the unix timestamp of the current block within the finalize scope.
This can be useful for managing time-based access control to a program.
The block.timestamp command must be called within a finalize block.
The type returned is i64.

assert.eq block.timestamp 1767976339i64;

network.id
The network.id command returns the ID of the network on which the program is executed.
This can be useful for managing network-specific program behavior.
The network.id command must be called within a finalize block.

Currently supported network IDs are:

0: Mainnet
1: Testnet
2: Canarynet
rand.chacha
The rand.chacha command returns a random number generated by the ChaCha20 algorithm.
This command supports sampling a random address, boolean, field, group, i8, i16, i32, i64, i128, u8, u16, u32, u64, u128, and scalar.
Up to two additional seeds can be provided to the rand.chacha command.
Currently, only ChaCha20 is supported, however, in the future, other random number generators may be supported.

rand.chacha into r0 as field;
rand.chacha r0 into r1 as field;
rand.chacha r0 r1 into r2 as field;

Hash
Aleo Instructions supports the following syntax for hashing to standard types.

hash.bhp256 r0 into r1 as address;
hash.bhp256 r0 into r1 as field;
hash.bhp256 r0 into r1 as group;
hash.bhp256 r0 into r1 as i8;
hash.bhp256 r0 into r1 as i16;
hash.bhp256 r0 into r1 as i32;
hash.bhp256 r0 into r1 as i64;
hash.bhp256 r0 into r1 as i128;
hash.bhp256 r0 into r1 as u8;
hash.bhp256 r0 into r1 as u16;
hash.bhp256 r0 into r1 as u32;
hash.bhp256 r0 into r1 as u64;
hash.bhp256 r0 into r1 as u128;
hash.bhp256 r0 into r1 as scalar;
hash.bhp512 ...;
hash.bhp768 ...;
hash.bhp1024 ...;
hash.ped64 ...;
hash.ped128 ...;
hash.psd2 ...;
hash.psd4 ...;
hash.psd8 ...;

Checkout the Aleo Instructions opcodes for a full list of supported hashing algorithms.

Commit
Aleo Instructions supports the following syntax for committing to standard types.
Note that the commit command requires any type as the first argument, and a scalar as the second argument.

commit.bhp256 r0 r1 into r2 as address;
commit.bhp256 r0 r1 into r2 as field;
commit.bhp256 r0 r1 into r2 as group;
commit.bhp512 ...;
commit.bhp768 ...;
commit.bhp1024 ...;
commit.ped64 ...;
commit.ped128 ...;

Checkout the Aleo Instructions opcodes for a full list of supported commitment algorithms.

position, branch.eq, branch.neq
The position command, e.g. position exit, indicates a point to branch execution to.
The branch.eq command, e.g. branch.eq r0 r1 to exit, which branches execution to the position indicated by exit if r0 and r1 are equal.
The branch.neq command, e.g. branch.neq r0 r1 to exit, which branches execution to the position indicated by exit if r0 and r1 are not equal.

** Example ** The finalize block exits successfully if the input is 0u8 and fails otherwise.

program test_branch.aleo;

function run_test:
    input r0 as u8.public;
    finalize r0;

finalize run_test:
    input r0 as u8.public;
    branch.eq r0 0u8 to exit;
    assert.eq true false;
    position exit;

Program Interoperability
The examples in this section will use the following environment.

.env
NETWORK=testnet
PRIVATE_KEY=APrivateKey1zkpE37QxQynZuEGg3XxYrTuvhzWbkVaN5NgzCdEGzS43Ms5 # user private key
ADDRESS=aleo1p2h0p8mr2pwrvd0llf2rz6gvtunya8alc49xldr8ajmk3p2c0sqs4fl5mm # user address

Child and Parent Program
The following example demonstrates how a program parent.aleo can call another program child.aleo.

./imports/child.aleo
program child.aleo;

function foo:
    output self.caller as address.public;
    output self.signer as address.public;


./parent.aleo
import child.aleo;

program parent.aleo;

// Make an external program call from `parent.aleo` to `function foo` in `child.aleo`.
function foo:
    call child.aleo/foo into r0 r1;
    output r0 as address.public;
    output r1 as address.public;
    output self.caller as address.public;
    output self.signer as address.public;


$ snarkvm execute foo

⛓  Constraints

 •  'test.aleo/foo' - 2,025 constraints (called 1 time)
 •  'child.aleo/foo' - 0 constraints (called 1 time)

➡️  Outputs

 # The address of the caller of `child.aleo/foo` => `program.aleo`
 • aleo18tpu6k9g6yvp7uudmee954vgsvffcegzez4y8v8pru0m6k6zdsqqw6mx3t 
 
 # The address that originated the sequence of calls leading up to `child.aleo/foo` => user address
 • aleo1p2h0p8mr2pwrvd0llf2rz6gvtunya8alc49xldr8ajmk3p2c0sqs4fl5mm
 
 # The address of the caller of `program.aleo/foo` => user address
 • aleo1p2h0p8mr2pwrvd0llf2rz6gvtunya8alc49xldr8ajmk3p2c0sqs4fl5mm
 
 # The address that originated the sequence of calls leading up to `program.aleo/foo` => user address
 • aleo1p2h0p8mr2pwrvd0llf2rz6gvtunya8alc49xldr8ajmk3p2c0sqs4fl5mm


User Callable Program
By asserting assert.eq self.caller self.signer; on line 4, a developer can restrict their function such that it can only be called by users.

./imports/child.aleo
program child.aleo;

function foo:
    assert.eq self.caller self.signer; // This check should fail if called by another program.
    output self.caller as address.public;
    output self.signer as address.public;


./parent.aleo
import child.aleo;

program parent.aleo;

// Make an external program call from `parent.aleo` to `function foo` in `child.aleo`.
function foo:
    call child.aleo/foo into r0 r1;
    output r0 as address.public;
    output r1 as address.public;
    output self.caller as address.public;
    output self.signer as address.public;



$ snarkvm execute foo

⚠️  Failed to evaluate instruction (call child.aleo/foo into r0 r1;):
Failed to evaluate instruction (assert.eq self.caller self.signer ;):
'assert.eq' failed: 
'aleo18tpu6k9g6yvp7uudmee954vgsvffcegzez4y8v8pru0m6k6zdsqqw6mx3t' 
is not equal to 
'aleo1p2h0p8mr2pwrvd0llf2rz6gvtunya8alc49xldr8ajmk3p2c0sqs4fl5mm' 
(should be equal)

Program Callable Program
By asserting assert.neq self.caller self.signer; on line 4, a developer can restrict their function such that it can only be called by other programs.

restrict.aleo
program restrict.aleo;

function foo:
    assert.neq self.caller self.signer; 
    output self.caller as address.public;
    output self.signer as address.public;


$ snarkvm execute foo

⚠️  Failed to evaluate instruction (assert.neq self.caller self.signer ;):
'assert.neq' failed: 
'aleo1p2h0p8mr2pwrvd0llf2rz6gvtunya8alc49xldr8ajmk3p2c0sqs4fl5mm'
is equal to 
'aleo1p2h0p8mr2pwrvd0llf2rz6gvtunya8alc49xldr8ajmk3p2c0sqs4fl5mm'
(should not be equal)

Edit this page
Last updated on Jan 9, 2026 by Zk
Previous
Hello Aleo
Next
Opcodes
Statically Typed
Explicit Types Required
Pass by Value
Register based
Data Types and Values
Booleans
Integers
Field Elements
Group Elements
Scalar Elements
Addresses
Signatures
Layout of an Aleo Program
Program ID
Import
Function
Closure
Struct
Array
Record
Special Operands
Mapping
Finalize
Futures
Finalize Commands
Program Interoperability
Learn
Getting Started
Core Concepts
Blogs
Press
Contribute
Contribution Guidelines
SnarkOS Contribute
SnarkVM Contribute
Documentation Contribute
Community
Chat on Discord
@AleoHQ on Twitter
Youtube
Governance
Company
About Aleo
Brand Assets
Opportunities
Copyright © 2026 Aleo Network Foundation
x1.00Skip to main content
Aleo
Aleo Developer
Concepts
Guides
Leo Language
Leo Playground
SDK
API Endpoints
Aleo.org
Introduction

Getting Started
Quick Start
Installation
Aleo Instructions

Overview
Installation
Hello Aleo
Language
Opcodes
Special Operands
Grammar
Tooling
Program Upgrades
Standard Programs

Token Registry
NFT Standards
Aleo Name Service
Solidity to Leo

FAQs
How to Get Help
Contribute

Aleo InstructionsLanguage
Aleo Instructions Language Guide
Statically Typed
Aleo instructions is a statically typed language, which means we must know the type of each variable before executing a circuit.

Explicit Types Required
There is no undefined or null value in Aleo instructions. When assigning a new variable, the type of the value must be explicitly stated.

Pass by Value
Expressions in Aleo instructions are always passed by value, which means their values are always copied when they are used as function inputs or in right sides of assignments.

Register based
There are no variable names in Aleo instructions. All variables are stored in registers denoted rX where X is a non-negative whole number starting from 0 r0, r1, r2, etc..

Data Types and Values
Booleans
Aleo instructions supports the traditional true or false boolean values. The explicit boolean type for booleans in statements is required.

function main:
    input r0: boolean.private;

Integers
Aleo instructions supports signed integer types i8, i16, i32, i64, i128 and unsigned integer types u8, u16, u32, u64, u128.

function main:
    input r0: u8.public;

info
Higher bit length integers generate more constraints in the circuit, which can slow down computation time.

Field Elements
Aleo instructions supports the field type for elements of the base field of the elliptic curve. These are unsigned integers less than the modulus of the base field, so the largest field element is 8444461749428370424248824938781546531375899335154063827935233455917409239040field.

function main:
    input r0: field.private;

Group Elements
The set of affine points on the elliptic curve passed into the Aleo instructions compiler forms a group. The curve is a Twisted Edwards curve with a = -1 and d = 3021. Aleo instructions supports a subgroup of the group, generated by a generator point, as a primitive data type. A group element is denoted by the x-coordinate of its point; for example, 2group means the point (2, 5553594316923449299484601589326170487897520766531075014687114064346375156608). The generator point is 1540945439182663264862696551825005342995406165131907382295858612069623286213group.

function main:
    input r0: group.private;

Scalar Elements
Aleo instructions supports the scalar type for elements of the scalar field defined by the elliptic curve subgroup. These are unsigned integers less than the modulus of the scalar field, so the largest scalar is 2111115437357092606062206234695386632838870926408408195193685246394721360382scalar.

function main:
    input r0: scalar.private;

Addresses
Addresses are defined to enable compiler-optimized routines for parsing and operating over addresses.

function main:
    input r0: address.private;

Signatures
Aleo uses a Schnorr signatures scheme to sign messages with an Aleo private key. Signatures can be verified in Aleo instructions using the sign.verify instruction.

sign.verify sign069ju4e8s66unu25celqycvsv3k9chdyz4n4sy62tx6wxj0u25vqp58hgu9hwyqc63qzxvjwesf2wz0krcvvw9kd9x0rsk4lwqn2acqhp9v0pdkhx6gvkanuuwratqmxa3du7l43c05253hhed9eg6ppzzfnjt06fpzp6msekdjxd36smjltndmxjndvv9x2uecsgngcwsc2qkns4afd r1 r2 into r3;


Layout of an Aleo Program
An Aleo program contains declarations of a Program ID, Imports, Functions, Closures, Structs, Records, Mappings, and Finalize. Ordering is only enforced for imports which must be at the top of file. Declarations are locally accessible within a program file. If you need a declaration from another program file, you must import it.

Program ID
A program ID is declared as {name}.{network}. The first character of a name must be lowercase. name can contain lowercase letters, numbers, and underscores. Currently, aleo is the only supported network domain.

program hello.aleo; // valid

program Foo.aleo;   // invalid
program baR.aleo;   // invalid
program 0foo.aleo;  // invalid
program 0_foo.aleo; // invalid
program _foo.aleo;  // invalid


Import
An import is declared as import {ProgramID};.
Imports fetch other declarations by their program ID and bring them into the current file scope. You can import dependencies that are downloaded to the imports directory.

import foo.aleo; // Import the `foo.aleo` program into the `hello.aleo` program.

program hello.aleo;


Function
A function is declared as function {name}:.
Functions contain instructions that can compute values. Functions must be in a program's current scope to be called.

function foo:
    input r0 as field.public;
    input r1 as field.private;
    add r0 r1 into r2;
    output r2 as field.private;


Function Inputs
A function input is declared as input {register} as {type}.{visibility};.
Function inputs must be declared just after the function name declaration.

// The function `foo` takes a single input `r0` with type `field` and visibility `public`.
function foo:
    input r0 as field.public;


Function Outputs
A function output is declared as output {register} as {type}.{visibility};.
Function outputs must be declared at the end of the function definition.

...
    output r0 as field.public;


Call a Function
In the Aleo protocol, calling a function creates a transition that can consume and produce records on-chain. Use the aleo run CLI command to pass inputs to a function and execute the program.
In Testnet, program functions cannot call other internal program functions. If you would like to develop "helper functions" that are called internally within a program, try writing a closure.

Call an Imported Function
Aleo programs can externally call other Aleo programs using the call {program}/{function} {register} into {register} instruction.

import foo.aleo;

program bar.aleo;

function call_external:
    input r0 as u64.private;
    call foo.aleo/baz r0 into r1; // Externally call function `baz` in foo.aleo with argument `r0` and store the result in `r1`.
    output r1 as u64.private;


Closure
A closure is declared as closure {name}:.
Closures contain instructions that can compute values. Closures are helper functions that cannot be executed directly. Closures may be called by other functions.

closure foo:
    input r0 as field;
    input r1 as field;
    add r0 r1 into r2;
    output r2 as field;


Call a Closure
Aleo programs can internally call other Aleo closures using the call {name} {register} into {register} instruction.

program bar.aleo;

function call_internal:
    input r0 as u64.private;
    call foo r0 into r1; // Internally call closure `foo` with argument `r0` and store the result in `r1`.
    output r1 as u64.private;


Struct
A struct is a data type declared as struct {name}:.
Structs contain component declarations {name} as {type}.

struct array3:
    a0 as u32;
    a1 as u32;
    a2 as u32;


To instantiate a struct in a program use the cast instruction.

function new_array3:
    input r0 as u32.private;
    input r1 as u32.private;
    input r2 as u32.private;
    cast r0 r1 r2 into r3 as array3;
    output r3 as array3.private;


Array
An array literal is written as [{value}, {value}, ..], where all the values are the same type. For example,

[true, false, true]

The type of an array includes the type of the elements and the length of the array [{type}; {length}]. The type of this example is

[boolean; 3u32]

Arrays can be initialized using the cast opcode.

function new_array:
    input r0 as boolean.private;
    input r1 as boolean.private;
    input r2 as boolean.private;
    cast r0 r1 r2 into r3 as [boolean; 3u32];
    output r3 as [boolean; 3u32].private;


Arrays can be indexed using {name}[{index}].

function get_array_element:
    input r0 as [boolean; 4u32].public;
    input r1 as u32.public;
    r0[r1] into r2;
    output r2 as boolean.public;


Arrays can be nested.

[[true, false, true, false], [false, true, false, true]]

function get_nested_array_element:
    input r0 as [[boolean; 4u32]; 2u32].public;
    r0[0u32][1u32] into r1;
    output r1 as boolean.public;


info
Aleo instructions currently only support fixed-length static arrays.

Record
A record type is declared as record {name}:.
Records contain component declarations {name} as {type}.{visibility};.
Record data structures must contain the owner declaration as shown below.
When passing a record as input to a program function the _nonce as group.{visibility} declaration is also required.

record token:
    // The token owner.
    owner as address.private;
    // The token amount.
    amount as u64.private;


To instantiate a record in a program use the cast instruction.

function new_token:
    input r0 as address.private;
    input r1 as u64.private;
    input r2 as u64.private;
    cast r0 r1 r2 into r3 as token.record;
    output r3 as token.record;


Special Operands
self.signer
The self.signer operand returns the user address that originated the transition.
This is particularly useful in intermediate programs that need to modify the state of the original caller rather than their own state.

In the example below, the transfer_public_as_signer function uses self.signer to decrement the balance from the original user's account rather than from the intermediate program's account.

// The `transfer_public_as_signer` function sends the specified amount
// from the signer's `account` to the receiver's `account`.
function transfer_public_as_signer:
    // Input the receiver.
    input r0 as address.public;
    // Input the amount.
    input r1 as u64.public;
    // Transfer the credits publicly.
    async transfer_public_as_signer self.signer r0 r1 into r2;
    // Output the finalize future.
    output r2 as credits.aleo/transfer_public_as_signer.future;

finalize transfer_public_as_signer:
    // Input the signer.
    input r0 as address.public;
    // Input the receiver.
    input r1 as address.public;
    // Input the amount.
    input r2 as u64.public;
    // Decrements `account[r0]` by `r2`.
    // If `account[r0] - r2` underflows, `transfer_public_as_signer` is reverted.
    get account[r0] into r3;
    sub r3 r2 into r4;
    set r4 into account[r0];
    // Increments `account[r1]` by `r2`.
    // If `account[r1]` does not exist, 0u64 is used.
    // If `account[r1] + r2` overflows, `transfer_public_as_signer` is reverted.
    get.or_use account[r1] 0u64 into r5;
    add r5 r2 into r6;
    set r6 into account[r1];


self.caller
The self.caller operand returns the address of the immediate caller of the program.

Mapping
A mapping is declared as mapping {name}:. Mappings contain key-value pairs and must be defined within a program.
Mappings are stored publicly on-chain. It is not possible to store data privately in a mapping.

// On-chain storage of an `account` map, with `owner` as the key,
// and `amount` as the value.
mapping account:
    // The token owner.
    key as address.public;
    // The token amount.
    value as u64.public;


Contains
A contains command that checks if a key exists in a mapping, e.g. contains accounts[r0] into r1;.

Get
A get command that retrieves a value from a mapping, e.g. get accounts[r0] into r1;.

Get or Use
A get command that uses the provided default in case of failure, e.g. get.or_use account[r1] 0u64 into r5;.

// The `transfer_public` function sends the specified amount
// from the caller's `account` to the receiver's `account`.
function transfer_public:
    // Input the receiver.
    input r0 as address.public;
    // Input the amount.
    input r1 as u64.public;
    // Transfer the credits publicly.
    async transfer_public self.caller r0 r1 into r2;
    // Output the finalize future.
    output r2 as credits.aleo/transfer_public.future;

finalize transfer_public:
    // Input the caller.
    input r0 as address.public;
    // Input the receiver.
    input r1 as address.public;
    // Input the amount.
    input r2 as u64.public;
    // Decrements `account[r0]` by `r2`.
    // If `account[r0] - r2` underflows, `transfer_public` is reverted.
    get account[r0] into r3;
    sub r3 r2 into r4;
    set r4 into account[r0];
    // Increments `account[r1]` by `r2`.
    // If `account[r1]` does not exist, 0u64 is used.
    // If `account[r1] + r2` overflows, `transfer_public` is reverted.
    get.or_use account[r1] 0u64 into r5;
    add r5 r2 into r6;
    set r6 into account[r1];


Set
A set command that sets a value in a mapping, e.g. set r0 into accounts[r0];.

Remove
A remove command that removes a key-value pair from a mapping, e.g. remove accounts[r0];.

Reading external program's mapping value
A program can also read an external program's mapping value. This enables your program to access and utilize data maintained by another program, making composability possible. e.g.:

// Import the external program whose mapping you want to read.
import credits.aleo;
program another_program.aleo;

function main:
    async main into r0;
    output r0 as another_program.aleo/main.future;

finalize main:
    // Read value from 'account' mapping in the external 'credits.aleo' program for the specified key.
    get credits.aleo/account[aleo1...] into r0;
    // Read value from 'account' mapping in the external 'credits.aleo' program for the specified key,
    // or use the default value 0u64 if the mapping does not exist.
    get.or_use credits.aleo/account[aleo1...] 0u64 into r1;


Finalize
A finalize is declared as finalize {name}:.
A finalize must immediately follow a function, and must have the same name;

// The `transfer_public_to_private` function turns a specified amount
// from the mapping `account` into a record for the specified receiver.
//
// This function publicly reveals the sender, the receiver, and the specified amount.
// However, subsequent methods using the receiver's record can preserve the receiver's privacy.
function transfer_public_to_private:
    // Input the receiver.
    input r0 as address.private;
    // Input the amount.
    input r1 as u64.public;
    // Construct a record for the receiver.
    cast r0 r1 into r2 as credits.record;
    // Decrement the balance of the sender publicly.
    async transfer_public_to_private self.caller r1 into r3;
    // Output the record of the receiver.
    output r2 as credits.record;
    // Output the finalize future.
    output r3 as credits.aleo/transfer_public_to_private.future;

finalize transfer_public_to_private:
    // Input the sender.
    input r0 as address.public;
    // Input the amount.
    input r1 as u64.public;
    // Retrieve the balance of the sender.
    get account[r0] into r2;
    // Decrements `account[r0]` by `r1`.
    // If `r2 - r1` underflows, `transfer_public_to_private` is reverted.
    sub r2 r1 into r3;
    // Updates the balance of the sender.
    set r3 into account[r0];


note
A finalize function is executed on chain after the zero-knowledge proof of the execution of the associated function is verified. If the finalize function succeeds, the program logic is executed.
If the finalize function fails, the program logic is reverted.

Futures
A future is equivalent to the call graph of the on-chain execution and is explicitly used when finalizing an execution. Instead of constructing the call graph implicitly from the code, the transition/circuit explicitly outputs a future, specifying which code blocks to run on-chain and how to run them.

future type
A user can declare a future type by specifying a Locator followed by the tag .future. For example, credits.aleo/mint_public.future. A function can only output a future and a finalize block can only take a future in as input. A closure cannot output a future or take a future in as input.

async call
A user can make an asynchronous call to the finalize block via the async keyword. For example, async mint_public r0 r1 into r2;. Note that the associated function must be specified. This operation produces a Future as output. async takes the place of the finalize command, which was allowed in the body of a function after the output statements.

await command
A user can evaluate a future inside of a finalize block using the await command. For example, await r0;. An await command can only be used in a finalize block. The operand must be a register containing a Future.

Indexing a future.
A register containing a future can be indexed using the existing index syntax. For example, r0[0u32]. This would get the input of the future at that specific index. Accesses can be nested to match the nested structure of a future.

Future example
program basic_math.aleo;

mapping uses:
    key user as address.public;
    value count as i64.public;

function add_and_count:
    input r0 as i64.private;
    input r1 as i64.private;
    add r0 r1 into r2;
    async add_and_count self.caller into r3;
    output r2 as i64.private;
    output r3 as basic_math.aleo/add_and_count.future;

finalize add_and_count:
    input r0 as address.public;
    get.or_use uses[r0] 0i64 into r1;
    add r1 1i64 into r2;
    set r2 into uses[r0];

function sub_and_count:
    input r0 as i64.private;
    input r1 as i64.private;
    sub r0 r1 into r2;
    async sub_and_count self.caller into r3;
    output r2 as i64.private;
    output r3 as basic_math.aleo/sub_and_count.future;

finalize sub_and_count:
    input r0 as address.public;
    get.or_use uses[r0] 0i64 into r1;
    add r1 1i64 into r2;
    set r2 into uses[r0];

/////////////////////////////////////////////////

import basic_math.aleo;

program count_usages.aleo;

function add_and_subtract:
    input r0 as i64.private;
    input r1 as i64.private;
    call basic_math.aleo/add_and_count r0 r1 into r2 r3;
    call basic_math.aleo/sub_and_count r2 r1 into r4 r5;
    assert.eq r0 r4;
    assert.eq r3[0u32] r5[0u32];
    async add_and_subtract r3 r5 into r6;
    output r0 as i64.private;
    output r6 as count_usages.aleo/add_and_subtract.future;

finalize add_and_subtract:
    input r0 as basic_math.aleo/add_and_count.future;
    input r1 as basic_math.aleo/sub_and_count.future;
    await r0;
    assert.eq r0[0u32] r1[0u32];
    await r1;


There are a number of rules associated with using these components.

If a function has a finalize block, it must have exactly one async instruction.
If a function has a finalize block, it's last output must be a future.
If a function does not have a finalize block, it cannot have an async instruction`.
All futures created by calls need to be input to the async instruction in the order they were produced.
An async call must reference the same function.
All calls must be made before invoking async.
The input futures types in a finalize block must match the order in which they were created in the function.
All futures in a finalize must be await-ed and in the order in which they were specified.
Instructions can be interleaved between invocations of call, async, and await.
Finalize Commands
The following commands are supported in Aleo Instructions to provide additional program functionality.

block.height
The block.height command returns the height of the block in which the program is executed (latest block height + 1).
This can be useful for managing time-based access control to a program.
The block.height command must be called within a finalize block.

assert.eq block.height 100u64;

block.timestamp
The block.timestamp command returns the unix timestamp of the current block within the finalize scope.
This can be useful for managing time-based access control to a program.
The block.timestamp command must be called within a finalize block.
The type returned is i64.

assert.eq block.timestamp 1767976339i64;

network.id
The network.id command returns the ID of the network on which the program is executed.
This can be useful for managing network-specific program behavior.
The network.id command must be called within a finalize block.

Currently supported network IDs are:

0: Mainnet
1: Testnet
2: Canarynet
rand.chacha
The rand.chacha command returns a random number generated by the ChaCha20 algorithm.
This command supports sampling a random address, boolean, field, group, i8, i16, i32, i64, i128, u8, u16, u32, u64, u128, and scalar.
Up to two additional seeds can be provided to the rand.chacha command.
Currently, only ChaCha20 is supported, however, in the future, other random number generators may be supported.

rand.chacha into r0 as field;
rand.chacha r0 into r1 as field;
rand.chacha r0 r1 into r2 as field;

Hash
Aleo Instructions supports the following syntax for hashing to standard types.

hash.bhp256 r0 into r1 as address;
hash.bhp256 r0 into r1 as field;
hash.bhp256 r0 into r1 as group;
hash.bhp256 r0 into r1 as i8;
hash.bhp256 r0 into r1 as i16;
hash.bhp256 r0 into r1 as i32;
hash.bhp256 r0 into r1 as i64;
hash.bhp256 r0 into r1 as i128;
hash.bhp256 r0 into r1 as u8;
hash.bhp256 r0 into r1 as u16;
hash.bhp256 r0 into r1 as u32;
hash.bhp256 r0 into r1 as u64;
hash.bhp256 r0 into r1 as u128;
hash.bhp256 r0 into r1 as scalar;
hash.bhp512 ...;
hash.bhp768 ...;
hash.bhp1024 ...;
hash.ped64 ...;
hash.ped128 ...;
hash.psd2 ...;
hash.psd4 ...;
hash.psd8 ...;

Checkout the Aleo Instructions opcodes for a full list of supported hashing algorithms.

Commit
Aleo Instructions supports the following syntax for committing to standard types.
Note that the commit command requires any type as the first argument, and a scalar as the second argument.

commit.bhp256 r0 r1 into r2 as address;
commit.bhp256 r0 r1 into r2 as field;
commit.bhp256 r0 r1 into r2 as group;
commit.bhp512 ...;
commit.bhp768 ...;
commit.bhp1024 ...;
commit.ped64 ...;
commit.ped128 ...;

Checkout the Aleo Instructions opcodes for a full list of supported commitment algorithms.

position, branch.eq, branch.neq
The position command, e.g. position exit, indicates a point to branch execution to.
The branch.eq command, e.g. branch.eq r0 r1 to exit, which branches execution to the position indicated by exit if r0 and r1 are equal.
The branch.neq command, e.g. branch.neq r0 r1 to exit, which branches execution to the position indicated by exit if r0 and r1 are not equal.

** Example ** The finalize block exits successfully if the input is 0u8 and fails otherwise.

program test_branch.aleo;

function run_test:
    input r0 as u8.public;
    finalize r0;

finalize run_test:
    input r0 as u8.public;
    branch.eq r0 0u8 to exit;
    assert.eq true false;
    position exit;

Program Interoperability
The examples in this section will use the following environment.

.env
NETWORK=testnet
PRIVATE_KEY=APrivateKey1zkpE37QxQynZuEGg3XxYrTuvhzWbkVaN5NgzCdEGzS43Ms5 # user private key
ADDRESS=aleo1p2h0p8mr2pwrvd0llf2rz6gvtunya8alc49xldr8ajmk3p2c0sqs4fl5mm # user address

Child and Parent Program
The following example demonstrates how a program parent.aleo can call another program child.aleo.

./imports/child.aleo
program child.aleo;

function foo:
    output self.caller as address.public;
    output self.signer as address.public;


./parent.aleo
import child.aleo;

program parent.aleo;

// Make an external program call from `parent.aleo` to `function foo` in `child.aleo`.
function foo:
    call child.aleo/foo into r0 r1;
    output r0 as address.public;
    output r1 as address.public;
    output self.caller as address.public;
    output self.signer as address.public;


$ snarkvm execute foo

⛓  Constraints

 •  'test.aleo/foo' - 2,025 constraints (called 1 time)
 •  'child.aleo/foo' - 0 constraints (called 1 time)

➡️  Outputs

 # The address of the caller of `child.aleo/foo` => `program.aleo`
 • aleo18tpu6k9g6yvp7uudmee954vgsvffcegzez4y8v8pru0m6k6zdsqqw6mx3t 
 
 # The address that originated the sequence of calls leading up to `child.aleo/foo` => user address
 • aleo1p2h0p8mr2pwrvd0llf2rz6gvtunya8alc49xldr8ajmk3p2c0sqs4fl5mm
 
 # The address of the caller of `program.aleo/foo` => user address
 • aleo1p2h0p8mr2pwrvd0llf2rz6gvtunya8alc49xldr8ajmk3p2c0sqs4fl5mm
 
 # The address that originated the sequence of calls leading up to `program.aleo/foo` => user address
 • aleo1p2h0p8mr2pwrvd0llf2rz6gvtunya8alc49xldr8ajmk3p2c0sqs4fl5mm


User Callable Program
By asserting assert.eq self.caller self.signer; on line 4, a developer can restrict their function such that it can only be called by users.

./imports/child.aleo
program child.aleo;

function foo:
    assert.eq self.caller self.signer; // This check should fail if called by another program.
    output self.caller as address.public;
    output self.signer as address.public;


./parent.aleo
import child.aleo;

program parent.aleo;

// Make an external program call from `parent.aleo` to `function foo` in `child.aleo`.
function foo:
    call child.aleo/foo into r0 r1;
    output r0 as address.public;
    output r1 as address.public;
    output self.caller as address.public;
    output self.signer as address.public;



$ snarkvm execute foo

⚠️  Failed to evaluate instruction (call child.aleo/foo into r0 r1;):
Failed to evaluate instruction (assert.eq self.caller self.signer ;):
'assert.eq' failed: 
'aleo18tpu6k9g6yvp7uudmee954vgsvffcegzez4y8v8pru0m6k6zdsqqw6mx3t' 
is not equal to 
'aleo1p2h0p8mr2pwrvd0llf2rz6gvtunya8alc49xldr8ajmk3p2c0sqs4fl5mm' 
(should be equal)

Program Callable Program
By asserting assert.neq self.caller self.signer; on line 4, a developer can restrict their function such that it can only be called by other programs.

restrict.aleo
program restrict.aleo;

function foo:
    assert.neq self.caller self.signer; 
    output self.caller as address.public;
    output self.signer as address.public;


$ snarkvm execute foo

⚠️  Failed to evaluate instruction (assert.neq self.caller self.signer ;):
'assert.neq' failed: 
'aleo1p2h0p8mr2pwrvd0llf2rz6gvtunya8alc49xldr8ajmk3p2c0sqs4fl5mm'
is equal to 
'aleo1p2h0p8mr2pwrvd0llf2rz6gvtunya8alc49xldr8ajmk3p2c0sqs4fl5mm'
(should not be equal)

Edit this page
Last updated on Jan 9, 2026 by Zk
Previous
Hello Aleo
Next
Opcodes
Statically Typed
Explicit Types Required
Pass by Value
Register based
Data Types and Values
Booleans
Integers
Field Elements
Group Elements
Scalar Elements
Addresses
Signatures
Layout of an Aleo Program
Program ID
Import
Function
Closure
Struct
Array
Record
Special Operands
Mapping
Finalize
Futures
Finalize Commands
Program Interoperability
Learn
Getting Started
Core Concepts
Blogs
Press
Contribute
Contribution Guidelines
SnarkOS Contribute
SnarkVM Contribute
Documentation Contribute
Community
Chat on Discord
@AleoHQ on Twitter
Youtube
Governance
Company
About Aleo
Brand Assets
Opportunities
Copyright © 2026 Aleo Network Foundation
x1.00Skip to main content
Aleo
Aleo Developer
Concepts
Guides
Leo Language
Leo Playground
SDK
API Endpoints
Aleo.org
Introduction

Getting Started
Quick Start
Installation
Aleo Instructions

Overview
Installation
Hello Aleo
Language
Opcodes
Special Operands
Grammar
Tooling
Program Upgrades
Standard Programs

Token Registry
NFT Standards
Aleo Name Service
Solidity to Leo

FAQs
How to Get Help
Contribute

Aleo InstructionsSpecial Operands
Aleo Special Operands
The following lists show the special operands supported by Aleo instructions.

Table of Special Operands
Name	Description
block.height	Returns height of the block within the finalize scope
block.timestamp	Returns the unix timestamp of the current block within the finalize scope
self.signer	Returns the user address that originated the transition
self.caller	Returns the address of the immediate caller of the program
network.id	Returns the ID of the network on which the program is executed
edition	Returns the program's version number (u16)
checksum	Returns the SHA3-256 hash of the program string
program_owner	Returns the address of the account that submitted the deployment transaction
Specification
The following is the specification for each special operands in the Aleo Virtual Machine (AVM).

network.id
Back to Top

Description
Returns the ID of the network on which the program is executed. This can be useful for managing network-specific program behavior. The network.id command must be called within a finalize block.

Currently supported network IDs are:

0: Mainnet
1: Testnet
2: Canarynet
Example Usage
assert.eq network.id 0u64;  // For mainnet

block.height
Back to Top

Description
Returns the height of the block within the finalize scope.
The block.height command must be called within a finalize block. The type returned is u64.

Example Usage
assert.eq block.height 100u64;

block.timestamp
Back to Top

Description
Returns the unix timestamp of the current block within the finalize scope.
The block.timestamp command must be called within a finalize block.
The type returned is i64.

Example Usage
assert.eq block.timestamp 1767976339i64;

self.signer
Back to Top

Description
Returns the user address that originated the transition.

Example Usage
assert.eq self.signer aleo1...;

self.caller
Back to Top

Description
Returns the address of the immediate caller of the program.

Example Usage
assert.eq self.caller aleo1...;

edition
Back to Top

Description
Returns the program's version number as an unsigned 16-bit integer (u16). The edition must be 0u16 for the initial deployment. For every valid upgrade, it must increment by exactly 1.

This operand is exclusively available within the finalize scope and is used for program upgradability.

Example Usage
assert.eq edition 0u16;  // Check if this is the initial deployment

note
You may also refer to other program's metadata by qualifying the operand with the program name, like Program::edition(credits.aleo), Program::edition(foo.aleo). You will need to import the program in your Leo file to use this syntax.

checksum
Back to Top

Description
Returns a 32-byte array ([u8; 32u32]) representing the SHA3-256 hash of the program string. It's a unique fingerprint of the program's code.

The checksum is required in any deployment of an upgradable program and is used to verify that the deployed code is what was expected.

This operand is exclusively available within the finalize scope.

Example Usage
assert.eq checksum <EXPECTED_CHECKSUM>;  // Verify program code matches expected hash

note
You may also refer to other program's metadata by qualifying the operand with the program name, like Program::checksum(credits.aleo), Program::checksum(foo.aleo). You will need to import the program in your Leo file to use this syntax.

program_owner
Back to Top

Description
Returns the address of the account that submitted the deployment transaction.

The program_owner is required in any deployment of an upgradable program and can be used to enforce access control for program upgrades.

This operand is exclusively available within the finalize scope.

Example Usage
assert.eq program_owner <ADMIN_ADDRESS>;  // Restrict upgrades to specific admin

note
You may also refer to other program's metadata by qualifying the operand with the program name, like Program::program_owner(credits.aleo), Program::program_owner(foo.aleo). You will need to import the program in your Leo file to use this syntax.

warning
Programs deployed before upgradability do not have a program_owner. Attempting to access it will result in a runtime error.

Edit this page
Last updated on Jan 9, 2026 by Zk
Previous
Opcodes
Next
Grammar
Table of Special Operands
Specification
network.id
block.height
block.timestamp
self.signer
self.caller
edition
checksum
program_owner
Learn
Getting Started
Core Concepts
Blogs
Press
Contribute
Contribution Guidelines
SnarkOS Contribute
SnarkVM Contribute
Documentation Contribute
Community
Chat on Discord
@AleoHQ on Twitter
Youtube
Governance
Company
About Aleo
Brand Assets
Opportunities
Copyright © 2026 Aleo Network Foundation
x1.00Skip to main content
Aleo
Aleo Developer
Concepts
Guides
Leo Language
Leo Playground
SDK
API Endpoints
Aleo.org
Introduction

Getting Started
Quick Start
Installation
Aleo Instructions

Overview
Installation
Hello Aleo
Language
Opcodes
Special Operands
Grammar
Tooling
Program Upgrades
Standard Programs

Token Registry
NFT Standards
Aleo Name Service
Solidity to Leo

FAQs
How to Get Help
Contribute

Aleo InstructionsGrammar
Aleo Instructions Grammar
This chapter contains a high-level grammar of Aleo instructions. A more detailed ABNF grammar can be found here.

program = *import
          "program" program-id ";"
          1*( mapping / struct / record / closure / function )
import = "import" program-id ";"
mapping = "mapping" identifier ":"
          mapping-key
          mapping-value
mapping-key = "key" identifier "as" finalize-type ";"
mapping-value = "value" identifier "as" finalize-type ";"
struct = "struct" identifier ":" 1*tuple
tuple = identifier "as" plaintext-type ";"
record = "record" identifier ":"
         "owner" "as" ( "address.public" / "address.private" ) ";"
         *entry
entry = identifier "as" entry-type ";"
closure = "closure" identifier ":"
          *closure-input
          1*instruction
          *closure-output
closure-input = "input" register "as" register-type ";"
closure-output = "output" operand "as" register-type ";"
function = "function" identifier ":"
           *function-input
           *instruction
           *function-output
           [ finalize-command finalize ]
function-input = "input" register "as" value-type ";"
function-output = "output" operand "as" value-type ";"
finalize = "finalize" identifier ":"
           *finalize-input
           1*command
           *finalize-output
finalize-input = "input" register "as" finalize-type ";"
finalize-output = "output" operand "as" finalize-type ";"
finalize-command = "finalize" *( operand ) ";"
command = contains
        / get
        / get-or-use
        / set
        / remove
        / random
        / position
        / branch
        / instruction
contains = "contains" identifier "[" operand "]" "into" register ";"
get = "get" identifier "[" operand "]" "into" register ";"
get-or-use = "get.or_use" identifier "[" operand "]" operand "into" register ";"
set = "set" operand "into" identifier "[" operand "]" ";"
remove = "remove" identifier "[" operand "]" ";"
random  = "rand.chacha" *2( operand ) "into" register "as" literal-type ";"
label = identifier
position = "position" label ";"
branch-op = "branch.eq" / "branch.neq"
branch = branch-op operand operand label ";"
instruction = ( unary
              / binary
              / ternary
              / is
              / assert
              / commit
              / hash
              / cast
              / call )
              ";"
unary = unary-op ( operand ) "into" register
unary-op = "abs" / "abs.w"
         / "double"
         / "inv"
         / "neg"
         / "not"
         / "square"
         / "sqrt"
binary = binary-op 2( operand ) "into" register
binary-op = "add" / "add.w"
          / "sub" / "sub.w"
          / "mul" / "mul.w"
          / "div" / "div.w"
          / "rem" / "rem.w"
          / "mod"
          / "pow" / "pow.w"
          / "shl" / "shl.w"
          / "shr" / "shr.w"
          / "and"
          / "or"
          / "xor"
          / "nand"
          / "nor"
          / "gt"
          / "gte"
          / "lt"
          / "lte"
ternary = ternary-op 3( operand ) "into" register
ternary-op = "ternary"
is = is-op operand operand "into" register
is-op = "is.eq" / "is.neq"
assert = assert-op operand operand
assert-op = "assert.eq" / "assert.neq"
commit = commit-op operand operand "into" register "as" ( address-type / field-type / group-type )
commit-op = "commit.bhp" ( "256" / "512" / "768" / "1024" )
          / "commit.ped" ( "64" / "128" )
hash = hash-op operand "into" register "as" ( arithmetic-type / address-type )
hash-op = "hash.bhp" ( "256" / "512" / "768" / "1024" )
        / "hash.ped" ( "64" / "128" )
        / "hash.psd" ( "2" / "4" / "8" )
        / "hash_many.psd" ( "2" / "4" / "8" )
cast = cast-op 1*( operand ) "into" register "as" cast-destination
cast-op = "cast"
cast-destination = register-type / "group.x" / "group.y"
call = "call" ( locator / identifier ) *( operand ) "into" 1*( register )
operand = literal
        / "group::GEN"
        / register-access
        / program-id
        / "self.caller"
        / "self.signer"
        / "block.height"
        / "block.timestamp"
literal = arithmetic-literal
        / address-literal
        / boolean-literal
arithmetic-literal = integer-literal
                   / field-literal
                   / group-literal
                   / scalar-literal
integer-literal = signed-literal / unsigned-literal
signed-literal = [ "-" ] 1*( digit *"_" ) signed-type
unsigned-literal = [ "-" ] 1*( digit *"_" ) unsigned-type
field-literal = [ "-" ] 1*( digit *"_" ) field-type
group-literal = [ "-" ] 1*( digit *"_" ) group-type
scalar-literal = [ "-" ] 1*( digit *"_" ) scalar-type
address-literal = "aleo1" 1*( address-char *"_" )
address-char = "0" / "2" / "3" / "4" / "5" / "6" / "7" / "8" / "9"
             / "a" / "c" / "d" / "e" / "f" / "g" / "h" / "j"
             / "k" / "l" / "m" / "n" / "p" / "q" / "r" / "s"
             / "t" / "u" / "v" / "w" / "x" / "y" / "z"
boolean-literal = "true" / "false"
register = "r" 1*digit
register-access = register *( "." identifier )
unsigned-type = "u8" / "u16" / "u32" / "u64" / "u128"
signed-type = "i8" / "i16" / "i32" / "i64" / "i128"
integer-type = unsigned-type / signed-type
field-type = "field"
group-type = "group"
scalar-type = "scalar"
arithmetic-type = integer-type / field-type / group-type / scalar-type
address-type = "address"
boolean-type = "boolean"
literal-type = arithmetic-type / address-type / boolean-type / string-type
plaintext-type = literal-type / identifier
value-type = plaintext-type ".constant"
           / plaintext-type ".public"
           / plaintext-type ".private"
           / identifier ".record"
           / locator ".record"
finalize-type = plaintext-type ".public"
              / identifier ".record"
              / locator ".record"
entry-type = plaintext-type ( ".constant" / ".public" / ".private" )
register-type = locator ".record"
              / identifier ".record"
              / plaintext-type
digit = "0"-"9"
uppercase-letter = "A"-"Z"
lowercase-letter = "a"-"z"
letter = uppercase-letter / lowercase-letter
identifier = letter *( letter / digit / "_" )
lowercase-identifier = lowercase-letter *( lowercase-letter / digit / "_" )
program-name = lowercase-identifier
program-domain = lowercase-identifier
program-id = program-name "." program-domain
locator = program-id "/" identifier


Edit this page
Last updated on Jan 9, 2026 by Zk
Previous
Special Operands
Next
Tooling
Learn
Getting Started
Core Concepts
Blogs
Press
Contribute
Contribution Guidelines
SnarkOS Contribute
SnarkVM Contribute
Documentation Contribute
Community
Chat on Discord
@AleoHQ on Twitter
Youtube
Governance
Company
About Aleo
Brand Assets
OpportunitiesSkip to main content
Aleo
Aleo Developer
Concepts
Guides
Leo Language
Leo Playground
SDK
API Endpoints
Aleo.org
Introduction

Getting Started
Quick Start
Installation
Aleo Instructions

Overview
Installation
Hello Aleo
Language
Opcodes
Special Operands
Grammar
Tooling
Program Upgrades
Standard Programs

Token Registry
NFT Standards
Aleo Name Service
Solidity to Leo

FAQs
How to Get Help
Contribute

Aleo InstructionsTooling
Tooling for Aleo Instructions
info
If you have installed a Leo syntax plugin. then you should already be able to see syntax highlighting for .aleo Aleo instructions.

Aleo maintains several syntax highlighting implementations across different platforms. If you do not see your favorite editor on this list, please reach out on GitHub.

Sublime Text.
Visual Studio Code.
Intellij.
Sublime Text

Download the editor here: https://www.sublimetext.com/download. Aleo instructions support for Sublime's LSP plugin is provided through a language-server.

Install
Install LSP and LSP-leo from Package Control.
Restart Sublime.
Usage
Follow these steps to toggle the Aleo instructions syntax highlighter.

Open Sublime Text.
From Settings > Select Color Scheme... > LSP-leo
This will also allow you to see syntax highlighting for Aleo instructions.
VSCode
 Download the editor here: https://code.visualstudio.com/download.

Install
Install Leo for VSCode from VSCode marketplace.
The correct extension ID is provablehq.leo-extension, and the description should state "the official VSCode extension for Leo".
Usage
Open VSCode.
Go to Settings > Extensions or use the left side panel Extensions button to enable the Leo plugin.
This will also allow you to see syntax highlighting for Aleo instructions.
IntelliJ
 Download the editor here: https://www.jetbrains.com/idea/download/.

Install
Download the Aleo Developer Plugin from JetBrains marketplace.
Click on the gear icon in the upper right > Plugins > gear icon up top > Install Plugin from Disk > Select the downloaded zip file
This will also allow you to see syntax highlighting for Aleo instructions.
Edit this page
Last updated on Jan 9, 2026 by Zk
Previous
Grammar
Next
Program Upgrades
Sublime Text
Install
Usage
VSCode
Install
Usage
IntelliJ
Install
Learn
Getting Started
Core Concepts
Blogs
Press
Contribute
Contribution Guidelines
SnarkOS Contribute
SnarkVM Contribute
Documentation Contribute
Community
Chat on Discord
@AleoHQ on Twitter
Youtube
Governance
Company
About Aleo
Brand Assets
Opportunities
Copyright © 2026 Aleo Network Foundation
x1.00Skip to main content
Aleo
Aleo Developer
Concepts
Guides
Leo Language
Leo Playground
SDK
API Endpoints
Aleo.org
Introduction

Getting Started
Quick Start
Installation
Aleo Instructions

Overview
Installation
Hello Aleo
Language
Opcodes
Special Operands
Grammar
Tooling
Program Upgrades
Standard Programs

Token Registry
NFT Standards
Aleo Name Service
Solidity to Leo

FAQs
How to Get Help
Contribute

Standard ProgramsToken Registry
Token Registry Program
Overview
The Token Registry Program is a standard program designed for issuing and managing new tokens on the Aleo blockchain. It operates as a singleton program because on Aleo, all imported programs must be known and deployed before the importing program, and dynamic cross-program calls are not currently supported which makes composability difficult to implement. This means that a DeFi program must be compiled with support for all token programs that it will ever interact with. If a new token program is subsequently deployed on-chain, the DeFi program will need to be re-compiled and redeployed on chain in order to interact with that token.

In the near-term, support for dynamic dispatch will resolve this but currently, the issue is circumvented by means of the token registry which can manage balances for many different ARC-20 tokens. This program would be the standard "hub" that all tokens and DeFi programs interface with. Individual ARC-20 tokens can register with the registry and mint new tokens via this program. Transfers of token value will occur by direct call to the registry rather than the ARC-20 program itself. The benefit of this approach is that DeFi programs do not need to be compiled with any special knowledge of individual ARC-20 tokens: their sole dependency will be the registry. Hence the deployment of new tokens does not require re-deployment of DeFi programs. Similarly, individual ARC-20 tokens can also be compiled with dependence on the registry, but no dependence on the DeFi programs. The registry thus allows interoperability between new tokens and DeFi programs, with no need for program re-deployment. As a secondary benefit, the registry will provide privacy benefits (via an improved anonymity set) because all private transfers within the registry will conceal the identity of the specific token being transferred.

This standard is emerged from extensive discussions and the approval of the ARC-21 proposal to enable token interoperability across different applications.

This documentation outlines the functions of the Token Registry Program and provides guidance on how to use it. The original source code can be found here.

How to use the Token Registry Program
Anyone can create a new token on Aleo using the token_registry.aleo program by calling the register_token transition with a unique token ID and specifying any name, symbol, decimals, and maximum supply. An optional external_authorization_required boolean grants extra control over token available to spend by requiring extra approval from an external_authorization_party, the external_authorization_party can unlocks certain amount of balances for spending with expiration over a specific owner's token using prehook_public or prehook_private. The admin can also set external_authorization_party to another address with update_token_management later if needed.

Once a token is registered, the tokens can be minted either publicly using mint_public or privately to a specific recipient using mint_private with roles MINTER_ROLE or SUPPLY_MANAGER_ROLE if not admin. The tokens can also be burned either publicly with burn_public or privately with burn_private with roles BURNER_ROLE or SUPPLY_MANAGER_ROLE if not admin.

The token owner then can transfer the token either publicly using transfer_public or privately to a specific recipient using transfer_private. The token can also be converted from public to private using transfer_public_to_private or from private to public using transfer_private_to_public.

Token Registry Program Data Structures
Token Record
  record Token {
    owner: address,
    amount: u128,
    token_id: field,
    external_authorization_required: bool,
    authorized_until: u32
  }

Token Record Fields
owner: The address of the token owner.
amount: The amount of tokens in the account.
token_id: The unique identifier for the token.
external_authorization_required: Whether or not the token requires external authorization.
authorized_until: The block height until which the token is authorized.
Token Metadata Struct
  struct TokenMetadata {
    token_id: field,
    name: u128, // ASCII text represented in bits, and the u128 value of the bitstring
    symbol: u128, // ASCII text represented in bits, and the u128 value of the bitstring
    decimals: u8,
    supply: u128,
    max_supply: u128,
    admin: address,
    external_authorization_required: bool, // whether or not this token requires authorization from an external program before transferring
    external_authorization_party: address
  }


Token Metadata Struct Fields
token_id: The unique identifier for the token.
name: The name of the token.
symbol: The symbol of the token.
decimals: The number of decimals for the token.
supply: The total supply of the token.
max_supply: The maximum supply of the token.
admin: The address of the token admin.
external_authorization_required: Whether or not the token requires external authorization.
external_authorization_party: The address of the external authorization party.
Token Owner Struct
  struct TokenOwner {
    account: address,
    token_id: field
  }

Token Owner Struct Fields
account: The address of the token owner.
token_id: The unique identifier for the token.
Balance Struct
  struct Balance {
    token_id: field,
    account: address,
    balance: u128,
    authorized_until: u32
  }

Balance Struct Fields
token_id: The unique identifier for the token.
account: The address of the token owner.
balance: The balance of the token.
authorized_until: The block height until which the token is authorized.
Allowance Struct
  struct Allowance {
    account: address,
    spender: address,
    token_id: field
  }

Allowance Struct Fields
account: The address of the token owner.
spender: The address of the spender.
token_id: The unique identifier for the token.
Token Registry Program Mappings
mapping registered_tokens: field => TokenMetadata;
Mapping of token IDs to token metadata structs.

mapping balances: field => Balance;
Mapping of the hash of the token ID and the account address to the balance struct.

mapping allowances: field => Allowance;
Mapping of the hash of the token ID, the account address, and the spender address to the allowance struct.

mapping roles: field => u8;
Mapping of the hash of the token ID and the account address to the role.

Token Registry Program Constants
const CREDITS_RESERVED_TOKEN_ID: field = 3443843282313283355522573239085696902919850365217539366784739393210722344986field;
Token ID reserved for the ALEO credits token.

const MINTER_ROLE: u8 = 1u8;
Role for the minter.

const BURNER_ROLE: u8 = 2u8;
Role for the burner.

const SUPPLY_MANAGER_ROLE: u8 = 3u8;
Role for the supply manager.

Token Registry Program Functions
The Token Registry Program includes the following functions:

initialize()
Description
Initializes the Token Registry Program by registering the ALEO credits token with predefined metadata. The token is initialized with a specific token ID, name "credits", symbol "credits", 6 decimals, and a max supply of 10 quadrillion. The program sets itself (wrapped_credits.aleo) as the admin and disables external authorization requirements to ensure the token metadata cannot be modified after initialization.

Parameters
Parameters are hardcoded in program to safeguard against frontrunning.

Returns
None.

register_token()
Description
Registers a new token with the Token Registry Program.

Parameters
public token_id: field: The unique identifier for the token.
public name: u128: The name of the token.
public symbol: u128: The symbol of the token.
public decimals: u8: The number of decimals for the token.
public max_supply: u128: The maximum supply of the token.
public external_authorization_required: bool: Whether or not the token requires external authorization.
public external_authorization_party: address: The address of the external authorization party.
Returns
Future: A Future to finalize the token registration.
update_token_management()
Description
Updates the token management settings.

Parameters
public token_id: field: The unique identifier for the token.
public admin: address: The address of the admin.
public external_authorization_party: address: The address of the external authorization party.
Returns
Future: A Future to finalize the token management update.
set_role()
Description
Sets the role for a specific token ID.

Parameters
public token_id: field: The unique identifier for the token.
public account: address: The address of the account.
public role: u8: The role to set.
Returns
Future: A Future to finalize the role set.
remove_role()
Description
Removes the role for a specific token ID.

Parameters
public token_id: field: The unique identifier for the token.
public account: address: The address of the account.
Returns
Future: A Future to finalize the role removal.
mint_public()
Description
Mints a new token publicly by the specific token ID's admin.

Parameters
public token_id: field: The unique identifier for the token.
public recipient: address: The address of the recipient.
public amount: u128: The amount of tokens to mint.
public authorized_until: u32: The block height until which the token is authorized.
Returns
Future: A Future to finalize the mint.
mint_private()
Description
Mints a new token privately by the specific token ID's admin.

Parameters
public token_id: field: The unique identifier for the token.
recipient: address: The address of the recipient that is not visible to the public.
public amount: u128: The amount of tokens to mint.
public external_authorization_required: bool: Whether or not the token requires external authorization.
public authorized_until: u32: The block height until which the token is authorized.
Returns
Token: The token record.
Future: A Future to finalize the mint.
burn_public()
Description
Burns a token publicly by the specific token ID's admin.

Parameters
public token_id: field: The unique identifier for the token.
public owner: address: The address of the owner.
public amount: u128: The amount of tokens to burn.
Returns
Future: A Future to finalize the burn.
burn_private()
Description
Burns a token privately by the specific token ID's admin.

Parameters
input_record: Token: The token record.
public amount: u128: The amount of tokens to burn.
Returns
Token: The token record with remaining balance.
Future: A Future to finalize the burn.
prehook_public()
Description
A function for the authorized party to modify authorized amount and new expiration publicly.

Parameters
public owner: address: The address of the owner.
public amount: u128: The amount of tokens to prehook.
public authorized_until: u32: The block height until which the token is authorized.
Returns
Future: A Future to finalize the prehook.
prehook_private()
Description
A function for the authorized party to modify authorized amount and new expiration privately.

Parameters
input_record: Token: The token record.
amount: u128: The amount of tokens to prehook.
authorized_until: u32: The block height until which the token is authorized.
Returns
Token: The unauthorized token record.
Token: The authorized token record.
Future: A Future to finalize the prehook.
transfer_public()
Description
Transfers a token publicly by the token owner.

Parameters
public token_id: field: The unique identifier for the token.
public recipient: address: The address of the recipient.
public amount: u128: The amount of tokens to transfer.
Returns
Future: A Future to finalize the transfer.
transfer_public_as_signer()
Description
Transfers a token publicly by the token owner as the transaction signer in any arbitrary program calls.

Parameters
public token_id: field: The unique identifier for the token.
public recipient: address: The address of the recipient.
public amount: u128: The amount of tokens to transfer.
Returns
Future: A Future to finalize the transfer.
approve_public()
Description
Approves a token for a spender to be able to transfer the token on behalf of the owner.

Parameters
public token_id: field: The unique identifier for the token.
public spender: address: The address of the spender.
public amount: u128: The amount of tokens to approve.
Returns
Future: A Future to finalize the approval.
unapprove_public()
Description
Revokes or reduces the approval for a spender to transfer the token on behalf of the owner.

Parameters
public token_id: field: The unique identifier for the token.
public spender: address: The address of the spender.
public amount: u128: The amount of tokens to unapprove.
Returns
Future: A Future to finalize the unapproval.
transfer_from_public()
Description
Transfers a token from the owner to the recipient after getting approval from the owner.

Parameters
public token_id: field: The unique identifier for the token.
public owner: address: The address of the owner.
public recipient: address: The address of the recipient.
public amount: u128: The amount of tokens to transfer.
Returns
Future: A Future to finalize the transfer.
transfer_public_to_private()
Description
Convert public token to private token by its owner.

Parameters
public token_id: field: The unique identifier for the token.
recipient: address: The address of the recipient that is not visible to the public.
public amount: u128: The amount of tokens to transfer.
public external_authorization_required: bool: Whether or not the token requires external authorization.
Returns
Token: The token record.
Future: A Future to finalize the transfer.
transfer_from_public_to_private()
Description
Convert public token to private token on behalf of the token owner after getting approval from the owner.

Parameters
public token_id: field: The unique identifier for the token.
public owner: address: The address of the owner.
recipient: address: The address of the recipient that is not visible to the public.
public amount: u128: The amount of tokens to transfer.
public external_authorization_required: bool: Whether or not the token requires external authorization.
Returns
Token: The token record.
Future: A Future to finalize the transfer.
transfer_private()
Description
Transfers a token privately by the token owner.

Parameters
recipient: address: The address of the recipient that is not visible to the public.
amount: u128: The amount of tokens to transfer.
input_record: Token: The token record.
Returns
Token: The remaining token record.
Token: The receiving token record.
Future: A Future to finalize the transfer.
transfer_private_to_public()
Description
Convert private token to public token by the token owner.

Parameters
public recipient: address: The address of the recipient that is visible to the public.
public amount: u128: The amount of tokens to transfer.
input_record: Token: The token record.
Returns
Token: The remaining token record.
Future: A Future to finalize the transfer.
join()
Description
Joins two private token records and become one single record. Does not change the total amount of the tokens.

Parameters
private token_1: Token: The first token record.
private token_2: Token: The second token record.
Returns
Token: The joined token record.
split()
Description
Splits a private token record into two new token records. Does not change the total amount of the tokens.

Parameters
private token: Token: The token record.
private amount: u128: The amount of tokens to split.
Returns
Token: The splitted token record.
Token: The remaining token record.
Edit this page
Last updated on Nov 4, 2025 by Zk
Previous
Standard Programs
Next
NFT Standards
Overview
How to use the Token Registry Program
Token Registry Program Data Structures
Token Record
Token Metadata Struct
Token Owner Struct
Balance Struct
Allowance Struct
Token Registry Program Mappings
Token Registry Program Constants
Token Registry Program Functions
initialize()
register_token()
update_token_management()
set_role()
remove_role()
mint_public()
mint_private()
burn_public()
burn_private()
prehook_public()
prehook_private()
transfer_public()
transfer_public_as_signer()
approve_public()
unapprove_public()
transfer_from_public()
transfer_public_to_private()
transfer_from_public_to_private()
transfer_private()
transfer_private_to_public()
join()
split()
Learn
Getting Started
Core Concepts
Blogs
Press
Contribute
Contribution Guidelines
SnarkOS Contribute
SnarkVM Contribute
Documentation Contribute
Community
Chat on Discord
@AleoHQ on Twitter
Youtube
Governance
Company
About Aleo
Brand Assets
Opportunities
Copyright © 2026 Aleo Network Foundation
x1.00Skip to main content
Aleo
Aleo Developer
Concepts
Guides
Leo Language
Leo Playground
SDK
API Endpoints
Aleo.org
Introduction

Getting Started
Quick Start
Installation
Aleo Instructions

Overview
Installation
Hello Aleo
Language
Opcodes
Special Operands
Grammar
Tooling
Program Upgrades
Standard Programs

Token Registry
NFT Standards
Aleo Name Service
Solidity to Leo

FAQs
How to Get Help
Contribute

Standard ProgramsNFT Standards
NFT Standards
Overview
The NFT Standards document outlines the specifications for implementing Non-Fungible Tokens (NFTs) on the Aleo blockchain. This standard emerged from the ARC-0721 proposal and was officially approved through community voting on Aleo Governance.

Similar to the Token Registry Program, the NFT standard faces challenges with program composability due to Aleo's current limitations on dynamic cross-program calls. To address this, an NFT Registry Program (ARC-722) has been proposed, which would serve as a central hub for NFT collections and enable better interoperability between NFTs and DeFi applications.

Key Features
The standard leverages Aleo's unique privacy features to provide:

Private or public token owner visibility
Private or public data associated with the token
Flexible on-chain and off-chain data storage options
Data Storage Options
On-chain vs Off-chain Data
The standard allows for NFT data to be stored in three ways:

On-chain Data

Direct storage of data on the blockchain
Can be either the complete data or a hash of the data
Off-chain Data

Reduces storage fees on the network
Typically stored as URIs pointing to external metadata
Can be combined with on-chain data for hybrid approaches
Hybrid Approach

Combination of on-chain and off-chain storage
Data can be public is stored on-chain (NFT ownership for example)
Private data is stored off-chain (NFT data for example)
Data Structures
NFT Record
record NFT {
    private owner: address,
    private data: data,
    private edition: scalar,
}

NFT Record Fields
owner: The private address of the NFT owner
data: The private data associated with the NFT
edition: A scalar value used for uniqueness and privacy
NFT View Record
record NFTView {
    private owner: address,
    private data: data,
    private edition: scalar,
    private is_view: bool
}

NFT View Record Fields
owner: The private address of the NFT owner
data: The private data associated with the NFT
edition: A scalar value used for uniqueness and privacy
is_view: A boolean flag to differentiate NFTView from NFT (always true)
Data Structure
struct attribute {
    trait_type: [field; 4],
    _value: [field; 4],
}

struct data {
    metadata: [field; 4], // URI of offchain metadata JSON
    // (optional) name: [field; 4],
    // (optional) image: [field; 16],
    // (optional) attributes: [attribute; 4],
    // (optional) ...
}

Data Structure Fields
metadata: URI pointing to off-chain metadata JSON
name: Optional name of the NFT
image: Optional image data
attributes: Optional array of attributes
An example of such an off-chain metadata JSON can be found here.

NFT Content Struct
struct nft_content {
    data: data,
    edition: scalar
}

NFT Content Struct Fields
data: The data associated with the NFT
edition: The edition number of the NFT
Mappings
mapping nft_commits: field => bool;
Mapping of NFT commits to their existence status.

mapping nft_owners: field => address;
Mapping of NFT commits to their public owners.

mapping nft_contents: field => nft_content;
Mapping of NFT commits to their public content.

Functions
commit_nft()
Description
Creates a unique identifier for an NFT by committing its data and edition to a field.

Parameters
nft_data: data: The data of the NFT
nft_edition: scalar: The edition number of the NFT
Returns
field: The NFT commit identifier
transfer_private_to_public()
Description
Converts a privately owned NFT to public ownership.

Parameters
private nft: NFT: The NFT record to convert
public to: address: The public recipient address
Returns
NFTView: The NFT view record
Future: A Future to finalize the transfer
publish_nft_content()
Description
Publishes NFT content to make it publicly accessible.

Parameters
public nft_data: data: The NFT data to publish
public nft_edition: scalar: The edition number to publish
Returns
Future: A Future to finalize the publication
update_edition_private()
Description
Updates the edition of a private NFT to re-obfuscate its content.

Parameters
private nft: NFT: The NFT record to update
private new_edition: scalar: The new edition number
Returns
NFT: The updated NFT record
Future: A Future to finalize the update
String Encoding
NFTs heavily rely on the use of strings, either for URL to off-chain data or for data itself. The standard specifies the following encoding for strings:

// Leo
string: [field; 4],

// Aleo instructions
string as [field; 4u32];

The length of the array can be freely adapted to match the maximum amount of characters required by the collection. The choice of fields type is motivated by the fact that they offer close to twice the amount of data for the same constraints as u128.

For JavaScript/TypeScript applications, an example for converting between JavaScript strings and Aleo plaintexts is available in the ARC-721 implementation.

Privacy Features
The standard implements privacy through several mechanisms:

Ownership Privacy
Private ownership is achieved through Aleo records
Public ownership can be enabled via the nft_owners mapping
Programs can own NFTs without revealing their data
Data Privacy
NFT data is kept private by default in records
The edition scalar ensures uniqueness without revealing data
NFT commits serve as unique identifiers without exposing underlying data
Re-obfuscation
NFTs can be re-obfuscated through a two-step process:

Transfer back to private ownership
Update the edition using update_edition_private()
async transition update_edition_private(
    private nft: NFT,
    private new_edition: scalar,
) -> (NFT, Future) {
    let out_nft: NFT = NFT {
        owner: nft.owner,
        data: nft.data,
        edition: new_edition,
    };
    let nft_commit: field = commit_nft(nft.data, new_edition);

    let update_edition_private_future: Future = finalize_update_edition_private(
        nft_commit
    );
    return (out_nft, update_edition_private_future);
}

async function finalize_update_edition_private(
    nft_commit: field,
) {
    assert(nft_commits.contains(nft_commit).not());
    nft_commits.set(nft_commit, true);
}

Important privacy considerations:

Previous NFT commits remain in the mapping to prevent revealing data relationships
New editions must be unique
Process maintains data privacy while creating new public identifiers
Approvals
The standard includes an approval mechanism that allows designated addresses to transfer NFTs on behalf of the owner. The approval system supports both collection-wide and individual NFT approvals:

struct approval {
    approver: address,
    spender: address
}

mapping for_all_approvals: field => bool; 
// Approval hash => Is approved

mapping nft_approvals: field => field;
// NFT commit => Approval hash

The approval system provides two main functions:

set_for_all_approval: Allows an owner to approve a spender for all NFTs in the collection
approve_public: Allows an owner to approve a spender for a specific NFT
Once approved, the spender can use transfer_from_public to transfer the NFT from the approver to a recipient address.

Settings
Collection-level settings are managed through a mapping:

mapping general_settings: u8 => field;
// Setting index => Setting value

Available settings indices and their purposes:

0u8: Amount of mintable NFTs (all editions)
1u8: Number of total NFTs (first-editions) that can be minted
2u8: Symbol for the NFT
3u8: Base URI for NFT, part 1
4u8: Base URI for NFT, part 2
5u8: Base URI for NFT, part 3
6u8: Base URI for NFT, part 4
7u8: Admin address hash
These settings allow for fine-grained control over the NFT collection's properties, including minting limits, metadata location, and administrative controls.

Implementation Notes
The standard is compatible with ARC21 standard for name and symbol of fungible tokens.

For collections where data can become public ("publishable collections"), the standard provides mechanisms to publish and manage public content while maintaining the option to re-obfuscate data when needed.

The NFT Registry Program (ARC-722) is proposed to address program composability challenges, similar to how the Token Registry Program works for fungible tokens. This registry would allow multiple implementations with different data structures, identified by the unique pair (registry_program_id, collection_id).

Edit this page
Last updated on Jun 2, 2025 by zklimaleo
Previous
Token Registry
Next
Aleo Name Service
Overview
Key Features
Data Storage Options
On-chain vs Off-chain Data
Data Structures
NFT Record
NFT View Record
Data Structure
NFT Content Struct
Mappings
Functions
commit_nft()
transfer_private_to_public()
publish_nft_content()
update_edition_private()
String Encoding
Privacy Features
Ownership Privacy
Data Privacy
Re-obfuscation
Approvals
Settings
Implementation Notes
Learn
Getting Started
Core Concepts
Blogs
Press
Contribute
Contribution Guidelines
SnarkOS Contribute
SnarkVM Contribute
Documentation Contribute
Community
Chat on Discord
@AleoHQ on Twitter
Youtube
Governance
Company
About Aleo
Brand Assets
Opportunities
Copyright © 2026 Aleo Network Foundation
x1.00Skip to main content
Aleo
Aleo Developer
Concepts
Guides
Leo Language
Leo Playground
SDK
API Endpoints
Aleo.org
Introduction

Getting Started
Quick Start
Installation
Aleo Instructions

Overview
Installation
Hello Aleo
Language
Opcodes
Special Operands
Grammar
Tooling
Program Upgrades
Standard Programs

Token Registry
NFT Standards
Aleo Name Service
Solidity to Leo

FAQs
How to Get Help
Contribute

Standard ProgramsAleo Name Service
Aleo Name Service
Overview
The Aleo Name Service (ANS) is a standard program designed for managing human-readable domain names on the Aleo blockchain. This standard emerged from the ARC-137 proposal and was officially approved through community voting on Aleo Governance.

ANS aims to simplify the interaction with Aleo's resources by allowing memorable and updatable human-readable identifiers. It supports both public and private domain names, each serving distinct use cases and privacy needs. Public domain names provide stable, human-readable identifiers that can be used to specify network resources, while private domain names enable private transfer of Aleo Credits (ACs) without revealing the recipient's real Aleo address.

Compatibility with ARC-0721
While ANS aims to be compatible with the ARC-0721 standard, it requires some modifications to the NFT structure to support its unique domain name registration functionality. These differences are necessary to enable the dynamic creation of domain name identifiers while maintaining compatibility with the broader Aleo ecosystem.

Divergence in NFT Structure
One of the key differences lies in the structure of the NFT used within ANS. While ARC-0721 defines a standard structure for NFTs, ANS requires a dynamic approach to the data field within the NFT record. This is due to the nature of domain name registration, where each NFT must reflect a unique identifier (name_hash) that is only determined at the time of domain registration by the user. Below is the ANS-specific NFT structure:

// The ANS NFT structure diverges from ARC-0721 in the `data` field.
// Here, `data` is not predefined but is dynamically created based on the domain name registered by the user.
// This `data` serves as the name_hash of the name, uniquely identifying the domain within ANS.
record NFT {
    owner: address,
    data: data, 
    edition: scalar // The edition number, similar to ARC-0721's structure.
}


Embracing Differences for Enhanced Functionality
The modifications to the NFT structure within ANS are necessary to support the protocol's functionality and objectives. While ANS strives to align with existing standards like ARC-0721, it also recognizes the need to innovate and adapt its NFT representation to serve its unique purpose effectively. This approach ensures that ANS can provide a robust and privacy-centric naming service that complements the broader Aleo ecosystem.

It is important for the community and developers to be aware of these differences for a seamless integration and to leverage the strengths of both standards where they apply.

This documentation outlines the functions of the Aleo Name Service Program and provides guidance on how to use it. The original source code can be found in the GitHub Repository.

ANS Components
The Aleo Name Service consists of three main components:

Registry Program: Manages the domain name system, mapping names to resolvers and allowing updates to these mappings
Registrars: Handle domain name assignments and top-level domain management
Resolvers: Process resource lookups and return requested data
Registry Program
The Registry Program is the core component of ANS, responsible for managing the domain name system and maintaining the mappings between names and their associated data.

Data Structures
Name Struct
struct Name {
    name: [u128; 4],
    parent: field // The name_hash of the parent name, for top level domain(tld), this attribute is 0field.
}


NameStruct
struct NameStruct {
    name: [u128; 4],
    parent: field,
    resolver: field // The resolver program address
}

Data Struct
struct data {
    metadata: [field; 4], // the first element is the name_hash of the name
}

NFT Record
record NFT {
    owner: address,
    data: data,
    edition: scalar
}

NFTView Record
record NFTView {
    owner: address,
    data: data,
    edition: scalar,
    is_view: bool
}

Mappings
mapping nft_owners: field => address;  
mapping names: field => NameStruct;  
mapping tlds: field => [u128; 4];  
mapping primary_names: address => field;  
mapping name_versions: field => u64;  
mapping resolvers: ResolverIndex => [u128; 4];  
mapping domain_credits: field => u64;  

Core Functions
The Registry Program provides the following core functions:

register_tld(): Registers a new top-level domain
register(): Registers a new domain name
register_private(): Registers a private subdomain
register_public(): Registers a public domain
transfer_private(): Transfers ownership of a private domain
transfer_public(): Transfers ownership of a public domain
set_primary_name(): Sets a domain as the primary name for an address
unset_primary_name(): Removes the primary name setting
set_resolver(): Sets the resolver address for a domain
Registrars
Registrars are responsible for managing domain name assignments and top-level domain (TLD) operations. They work in conjunction with the Registry Program to handle domain registration and management.

Registrar Functions
Domain name validation
TLD management
Registration fee handling
Domain renewal processing
Resolvers
Resolvers are specialized programs that process resource lookups and return requested data for domains. They handle the actual resolution of domain names to their associated resources.

Resolver Functions
Resource lookup processing
Data resolution
Record management
Version control
ResolverIndex Struct
struct ResolverIndex {
    name: field, // The name_hash of the domain
    category: u128, // The type of the resolver
    version: u64 // The version of the resolver
}

Resolver Operations
set_resolver_record(): Sets a resolver record for a private domain
unset_resolver_record(): Removes a resolver record for a private domain
set_resolver_record_public(): Sets a resolver record for a public domain
unset_resolver_record_public(): Removes a resolver record for a public domain
Privacy Credit Transfer Scheme
The Privacy Credit Transfer Scheme is an innovative feature built upon the Aleo Name Service (ANS) that facilitates the private transfer of credits. This scheme ensures that neither party in the transaction is required to disclose their Aleo address, thereby enhancing privacy while maintaining ease of use.

Transfer Credits
This function enables the transfer of credits to an ANS domain without revealing the recipient's real Aleo address. It involves a secret that allows the domain holder to claim the transferred credits privately.

Transfer private credits to ANS name
// Function for transferring credits to an ANS domain without revealing the domain holder's real address.
// @param receiver: The name_hash of the recipient ANS domain.
// @param secret: The secret associated with the transaction, used for claim verification.
// @param amount: The amount of credits to be transferred.
// @param pay_record: The record of the payment being made.
transition transfer_credits(receiver: field, secret: [u128; 2], amount: u64, pay_record: credits.leo/credits)


Transfer public credits to ANS name
// Function for transferring credits to an ANS domain without revealing the domain holder's real address.
// @param receiver: The name_hash of the recipient ANS domain.
// @param secret: The secret associated with the transaction, used for claim verification.
// @param amount: The amount of credits to be transferred.
transition transfer_credits_public(receiver: field, secret: [u128; 2], amount: u64)


Claim Credits
These functions allow domain holders to claim the transferred credits. Depending on whether the domain is public or private, the appropriate claim function is used.

Claim Credits Private
// Function for a domain holder to claim credits using a private ANS domain represented by an NFT and a secret.
// This ensures that the claim process remains private and the domain holder's real address is not exposed.
// @param receiver: The receiver address
// @param nft: The NFT record representing the private ANS domain.
// @param secret: The secret used to verify the claim.
// @param amount: The amount of credits to be claimed.
transition claim_credits_private(receiver: address, nft: NFT, secret: [u128; 2], amount: u64)


Claim Credits Public - the caller is the owner of the ANS name
// Similar to the private claim function, this enables the claiming of credits for a public ANS domain.
// The domain holder uses a secret to claim the credits, maintaining privacy.
// @param receiver: The receiver address
// @param name_hash: The name_hash of the public ANS domain.
// @param secret: The secret used to verify the claim.
// @param amount: The amount of credits to be claimed.
transition claim_credits_public(receiver: address, name_hash: field, secret: [u128; 2], amount: u64)


Claim Credits as Signer - the signer is the owner of the ANS name
// Similar to the private claim function, this enables the claiming of credits for a public ANS domain.
// The domain holder uses a secret to claim the credits, maintaining privacy.
// @param receiver: The receiver address
// @param name_hash: The name_hash of the public ANS domain.
// @param secret: The secret used to verify the claim.
// @param amount: The amount of credits to be claimed.
transition claim_credits_as_signer(receiver: address, name_hash: field, secret: [u128; 2], amount: u64)


Edit this page
Last updated on Nov 4, 2025 by Zk
Previous
NFT Standards
Next
Solidity to Leo
Overview
Compatibility with ARC-0721
ANS Components
Registry Program
Data Structures
Mappings
Core Functions
Registrars
Registrar Functions
Resolvers
Resolver Functions
ResolverIndex Struct
Resolver Operations
Privacy Credit Transfer Scheme
Transfer Credits
Claim Credits
Learn
Getting Started
Core Concepts
Blogs
Press
Contribute
Contribution Guidelines
SnarkOS Contribute
SnarkVM Contribute
Documentation Contribute
Community
Chat on Discord
@AleoHQ on Twitter
Youtube
Governance
Company
About Aleo
Brand Assets
Opportunities
Copyright © 2026 Aleo Network Foundation
x1.00
Copyright © 2026 Aleo Network Foundation
x1.00Skip to main content
Aleo
Aleo Developer
Concepts
Guides
Leo Language
Leo Playground
SDK
API Endpoints
Aleo.org
Introduction

Getting Started
Quick Start
Installation
Aleo Instructions

Overview
Installation
Hello Aleo
Language
Opcodes
Special Operands
Grammar
Tooling
Program Upgrades
Standard Programs

Token Registry
NFT Standards
Aleo Name Service
Solidity to Leo

Comparison Table
Migration Guide
Token Standard Differences
NFT Standard Differences
FAQs
How to Get Help
Contribute

Solidity to LeoComparison Table
Comparison Table
A side-by-side comparison between Leo (Aleo) and Solidity (Ethereum/EVM).

Feature	Leo	Solidity
Execution Model	Off-chain execution + on-chain proof verification and optional on-chain execution	Fully on-chain execution
State Model	Public key-value mapping and private record storage	Key-value contract storage, temporary transient storage, temporary memory and read-only calldata
Privacy	Built-in privacy with private inputs (messages), private outputs (state changes) and private user	No privacy – all state and calldata are public
Execution Cost	Storage cost + finalize cost (on-chain compute based on instruction)	Gas based on opcode
Supported Types	bool, u8…u128, i8…i128, plus field, group, scalar; no bytes, dynamic arrays and string	bool, (u)int8…256, bytes, dynamic arrays, string, etc.
Tooling	leo CLI, Leo debugger, IDE plugins, DokoJS, Amareleo	Hardhat, Foundry, Remix, Truffle etc.
Randomness	ChaCha random function	Relies on 3rd party off-chain oracle (e.g. Chainlink VRF)
Error Handling	assert, assert_eq, assert_neq (no custom msg)	assert, require, revert with optional revert strings
Dispatch Type	Static dispatch (with dynamic dispatch in roadmap)	Dynamic dispatch
Built-in Functions	block.height, block.timestamp, self.signer, self.caller, self.address, network.id, signature::verify, group::GEN, BHP hashes and commits, Keccak hashes, Pedersen hashes and commits, Poseidon hashes, SHA3 hashes etc.	keccak256, sha256, ripemd160, ecrecover, address.(member functions), abi.encode, abi.decode, block.(metadata) etc.
Token Standard	ARC-21	ERC20
NFT Standard	ARC-721	ERC721
Upgradability	Native upgradeability coming soon with ARC-6	Via proxy patterns (Transparent, UUPS, Beacon)
Block Explorers	Provable Explorer (Beta), VXB.ai (Formerly Aleo123.io), Aleoscan etc.	Etherscan, Blockscout etc.
Edit this page
Last updated on Jan 12, 2026 by Zk
Previous
Solidity to Leo
Next
Migration Guide
Learn
Getting Started
Core Concepts
Blogs
Press
Contribute
Contribution Guidelines
SnarkOS Contribute
SnarkVM Contribute
Documentation Contribute
Community
Chat on Discord
@AleoHQ on Twitter
Youtube
Governance
Company
About Aleo
Brand Assets
Opportunities
Copyright © 2026 Aleo Network Foundation
x1.00