---
title: "AuthZ in production"
description: "RBAC vs ABAC, policy-as-code, and OPA: how authorization works in production systems."
date: 2025-07-31
category: Security
readTime: 6 min read
tags: ["security"]
sample: false
mediumUrl: https://medium.com/@akshat_aggarwal/authz-in-production-112d83356dcd
---

Imagine you have a key to a house. The lock on the front door only cares about one thing: is this the right key? That’s **authentication**, proving you are who you say you are. But once you’re inside, what are you allowed to do? Can you watch TV? Open the fridge? Remodel the kitchen? That’s **authorization**, and it’s a whole different, and much trickier, question.

In the world of big companies, authorization is the set of rules that governs what every employee, partner, and even automated service can do with the company’s digital resources. Getting it wrong is a huge deal. It can lead to massive data breaches, a loss of customer trust, and serious financial penalties. Broken access control is consistently ranked as the top security risk for web applications for a reason.

This guide will walk you through how modern companies think about authorization, from the models they use to the tools that bring it all to life.

### How to Decide Who Gets Access: Roles vs. Attributes

At the heart of any authorization system is a model for how to make decisions. For a long time, the choice has been between two main approaches: one based on roles, and a newer, more flexible one based on attributes.

#### **Role-Based Access Control (RBAC): The Classic Approach**

Role-Based Access Control (RBAC) is the most common model, and it works just like it sounds. People are assigned roles, like “Administrator,” “Sales Rep,” or “Editor,” and each role comes with a specific set of permissions.

- **Why it’s popular:** It’s simple to understand and manage, especially in smaller organizations or those with very defined job functions. Onboarding a new sales rep is as easy as giving them the “Sales Rep” role. When they move to a new department, you just change their role, and their permissions update automatically.
- **The big problem:** As a company grows, this model can get messy. You start needing more and more specific roles: “Editor-Marketing-US,” “Editor-Finance-Read-Only,” “Editor-Temporary-Contractor.” This is called **“role explosion,”** and it can make the system incredibly complex and hard to manage, ironically reintroducing the security risks RBAC was meant to solve.

#### **Attribute-Based Access Control (ABAC): The Modern, Smarter Way**

Instead of static roles, Attribute-Based Access Control (ABAC) makes decisions using the specific characteristics (or attributes) of the situation. It looks at a few key things in real-time:

1. **Who is the user?** (e.g., their job title, department, security clearance)
2. **What are they trying to access?** (e.g., a financial report, a public blog post, customer data)
3. **What are they trying to do?** (e.g., read, write, delete)
4. **What is the context?** (e.g., time of day, user’s location, device they’re using)
- **Why it’s powerful:** ABAC is incredibly flexible and context-aware. It lets you create fine-grained rules that are impossible with RBAC alone. For example, a policy could say: “Allow a doctor to read a patient’s medical record*only if* they are in the same department as the patient and it’s during business hours.” This dynamic approach is perfect for large, complex companies with strict security and compliance needs.
- **The trade-off:** It can be more complex to set up initially, as you have to define all the relevant attributes and policies.

Many companies find a sweet spot by using a **hybrid approach**: using RBAC for broad, baseline permissions and layering ABAC on top for more sensitive operations.

### Writing the Rules: The Policy-as-Code Revolution

In the past, security policies lived in documents or were configured by clicking through menus in a UI. This was slow, prone to human error, and couldn’t keep up with the pace of modern software development. The solution is **Policy-as-Code (PaC)**.

The idea is simple but powerful: treat your authorization policies just like your application code. They are written in text files, stored in a version control system like Git, and can be automatically tested and deployed.

This approach has huge benefits:

- **Speed and Automation:** Policy changes can be rolled out quickly and safely through automated pipelines.
- **Collaboration:** Developers, security, and operations teams can all work together on the same policy files, breaking down silos.
- **Traceability:** Every change to a policy is tracked, reviewed, and auditable. If a new rule causes problems, you can instantly roll it back.

### **Open Policy Agent (OPA): The Engine for Policy-as-Code**

The most popular tool for making Policy-as-Code a reality is the **Open Policy Agent (OPA)**. OPA is an open-source policy engine. Think of it as a small, fast brain that does one thing very well: it takes a policy you’ve written and some data about a request, and it gives you a decision, like “allow” or “deny.”

Policies for OPA are written in a special-purpose language called **Rego**. Rego is designed to be easy to read and write, making it perfect for expressing rules about who can do what.

Let’s look at a simple example. Imagine we want to write a policy for accessing employee salary data with these rules:

1. By default, nobody can see anything.
2. You can see your own salary.
3. Managers can see the salaries of people who report directly to them.
4. Anyone in HR can see anyone’s salary.

Here’s what that looks like in a Rego policy file:

```
package httpapi.authz

# This is data that would normally come from your HR system.
# We define it here for the example.
subordinates := {
    "bob": ["alice"],
    "betty": ["charlie"]
}

user_roles := {
    "david": ["hr"]
}

# Rule 1: By default, all requests are denied.
default allow = false

# Rule 2: Allow users to get their own salary.
# 'allow' becomes true if the user is asking for their own path.
allow {
    input.method == "GET"
    input.path == ["finance", "salary", input.user]
}

# Rule 3: Allow managers to get their subordinates' salaries.
allow {
    input.method == "GET"
    input.path = ["finance", "salary", username]
    subordinates[input.user][_] == username
}

# Rule 4: Allow HR users to view any salary.
allow {
    input.method == "GET"
    roles := user_roles[input.user]
    roles[_] == "hr"
}
```

This single file clearly defines all our rules. The application code doesn’t need to know any of this logic; it just asks OPA, “Hey, can Bob see Alice’s salary?” and OPA provides the answer. This separation makes the whole system cleaner, more secure, and much easier to update.

Handling authorization in a large company is a journey from simple, rigid rules to a more intelligent, flexible, and automated system. It’s about moving from static roles to dynamic, context-aware policies that are written and managed as code. By embracing modern tools and architectures, companies can build security systems that are not only stronger but also more agile, allowing them to protect their data while still moving at the speed of business.
