---
title: "Using PostgreSQL CTEs"
description: A practical guide to writing readable, correct queries with PostgreSQL common table expressions.
date: 2025-04-29
category: PostgreSQL
readTime: 7 min read
sample: false
mediumUrl: https://medium.com/@akshat_aggarwal/using-postgresql-ctes-721bfbd85890
---

As developers, we often write SQL queries that grow complex, making them hard to read and update. PostgreSQL’s Common Table Expressions (CTEs), used with the WITH clause, help by letting you break down long queries into named, temporary blocks. Think of a CTE as a temporary table you define and use within a single query. This guide covers the basics of CTEs, including how to use them for recursive tasks and control result order.

### Understanding Common Table Expressions

#### What is a CTE?

A CTE creates a temporary result set that exists only for the duration of the query (SELECT, INSERT, UPDATE, DELETE) it's part of. It's like a temporary view, not stored permanently.

#### PostgreSQL Syntax: The WITH Clause

Start with WITH, give your CTE a name, use AS, and put the query defining it in parentheses.

```sql
WITH CteName AS (
    -- Query defining the CTE
    SELECT column1, column2 FROM source_table WHERE condition
)
-- Main query using the CTE
SELECT * FROM CteName;
```

You can define multiple CTEs separated by commas. A later CTE can use results from an earlier one.

```sql
WITH
  RegionalSales AS (
    SELECT region, SUM(amount) AS total_sales FROM sales GROUP BY region
  ),
  TopRegions AS (
    -- Uses the RegionalSales CTE
    SELECT region FROM RegionalSales
    WHERE total_sales > (SELECT AVG(total_sales) FROM RegionalSales)
  )
-- Main query using TopRegions
SELECT s.* FROM sales s JOIN TopRegions tr ON s.region = tr.region;
```

You can also specify a list of column names for the CTE immediately after the CTE name. If provided, this list overrides the column names derived from the subquery. If the column list is omitted, the CTE’s column names are taken directly from the output columns of its defining subquery.

```sql
WITH product_summary (product_code, total_quantity) AS (
    SELECT product_id, SUM(quantity)
    FROM order_items
    GROUP BY product_id
)
SELECT * FROM product_summary WHERE total_quantity > 100;
```

#### Why use CTEs?

1. *Better Readability and Maintainability*: naming parts of your query with CTEs makes the logic flow much clearer than using deeply nested subqueries. This makes the code easier to maintain and update later.
2. *Modularity and Reusing Logic:* CTEs let you define a piece of logic once and refer to it multiple times within the same main query, avoiding repetition.
3. *Simplifying Calculations:* Multi-step calculations are easier to follow when intermediate results are calculated within named CTEs.

#### CTEs vs. Subqueries vs. Views

- **CTEs:** Temporary, named blocks within a *single* query. Great for readability and reuse *within that query*. Can be recursive.
- **Subqueries:** Queries nested inside another query. Good for simple, one-off steps but can hurt readability if overused.
- **Views:** Permanent database objects that store a query definition. Good for reusing complex logic across *multiple different* queries.

### Unlocking Recursion

A recursive CTE is a Common Table Expression defined in such a way that its definition includes a reference to itself. This self-referencing capability makes them ideally suited for tasks that naturally involve recursion or iteration, such as:

- **Querying Hierarchical Data:** Navigating organizational structures, product categories, file systems, comment threads, or any tree-like data.
- **Generating Series:** Creating sequences of numbers, dates, or other values based on an iterative rule.
- **Graph Traversal:** Finding paths or connections in graph-like data structures (though potentially complex).

#### Syntax

In PostgreSQL, as mandated by the SQL standard, if any CTE within a WITH clause references itself (directly or indirectly), the clause *must* begin with WITH RECURSIVE. Even if only one of multiple CTEs defined in the clause is recursive, WITH RECURSIVE is required.

```sql
WITH RECURSIVE cte_name (column_list) AS (
    -- Anchor Member (Non-Recursive Term)
    SELECT...
    UNION ALL -- Or UNION
    -- Recursive Member & Termination
    SELECT... FROM cte_name JOIN... WHERE... -- References cte_name
)
SELECT * FROM cte_name;
```

#### *Anatomy of a Recursive CTE*

1. **Anchor Member:** The starting point (base case). A query that *doesn’t* refer to the CTE itself.
2. **Recursive Member:** The iterative part. It *must* refer to the CTE’s name to build upon the previous step’s results.
3. **UNION ALL / UNION**: Connects the anchor and recursive results. UNION ALL is most commonly used because it preserves all rows generated in each iteration
4. **Termination Condition:** Essential! The recursive member needs a condition (usually in WHERE) to eventually stop producing rows and prevent an infinite loop.

PostgreSQL runs the anchor query once. Then, it repeatedly runs the recursive query, using the results from the previous step, until the recursive query stops producing new rows.

#### *Generating a Number Series (1 to 9)*

```sql
WITH RECURSIVE number_series (n) AS (
    -- Anchor Member: Start the series at 1
    VALUES (1)
  UNION ALL
    -- Recursive Member: Add 1 to the previous value
    SELECT n + 1
    FROM number_series
    WHERE n < 10 -- Termination Condition: Stop when n reaches 10
)
-- Select all generated numbers
SELECT n FROM number_series; 
```

Here, the anchor VALUES (1) provides the starting point. The recursive member SELECT n + 1 FROM number_series WHERE n < 10 takes the value(s) from the previous iteration (n) and generates the next value (n + 1), continuing as long as n is less than 10.

#### Traversing Hierarchical Data

A classic example involves navigating an organizational hierarchy stored in an employees table (e.g., employee_id, name, manager_id). This query finds all employees reporting (directly or indirectly) to the employee with employee_id = 1, tracking the hierarchy level and path:

```sql
CREATE TABLE employees (
    employee_id INT PRIMARY KEY,
    name VARCHAR(100),
    manager_id INT REFERENCES employees(employee_id)
);

INSERT INTO employees VALUES
(1, 'CEO', NULL),
(2, 'VP Engineering', 1),
(3, 'VP Sales', 1),
(4, 'Eng Lead', 2),
(5, 'Sales Lead', 3),
(6, 'Engineer 1', 4),
(7, 'Engineer 2', 4),
(8, 'Sales Rep 1', 5),
(9, 'Sales Rep 2', 5);

WITH RECURSIVE EmployeeHierarchy AS (
    -- Anchor Member: Select the starting employee (the top manager in this case)
    SELECT
        employee_id,
        name,
        manager_id,
        1 AS level, -- Start at level 1
        ARRAY[employee_id] AS path -- Initialize path array
    FROM employees
    WHERE employee_id = 1 -- Or manager_id IS NULL for the ultimate root

    UNION ALL

    -- Recursive Member: Find direct reports of employees from the previous iteration
    SELECT
        e.employee_id,
        e.name,
        e.manager_id,
        eh.level + 1, -- Increment level
        eh.path || e.employee_id -- Append current employee_id to path
    FROM employees e
    JOIN EmployeeHierarchy eh ON e.manager_id = eh.employee_id
    -- Cycle Detection: Optional but good practice if cycles are possible
    WHERE NOT (e.employee_id = ANY(eh.path))
)
-- Select the full hierarchy
SELECT
    employee_id,
    name,
    manager_id,
    level,
    path
FROM EmployeeHierarchy;
```

*Note:* The path array provides a way to detect cycles during traversal. If the employee_id being considered for the next level is already present in the path array accumulated so far, it indicates a loop. The WHERE NOT (e.employee_id = ANY(eh.path)) condition effectively prunes branches that would lead back to an ancestor, preventing infinite recursion.

#### Controlling Search Order

When querying hierarchies, you often need results in a specific order, like showing a manager’s whole team together. PostgreSQL’s SEARCH clause is the standard way to control this.

- **Depth-First (DFS):** Goes deep down one branch before exploring others.
- **Breadth-First (BFS):** Explores level by level.

### PostgreSQL’s SEARCH Clause

This clause adds a special column to your CTE results that you use in your final ORDER BY to get DFS or BFS order.

#### **Syntax**

```sql
WITH RECURSIVE CteName AS (...)
SEARCH DEPTH FIRST BY sort_key_column(s) SET sequence_column -- For DFS
-- or
-- SEARCH BREADTH FIRST BY sort_key_column(s) SET sequence_column -- For BFS
SELECT * FROM CteName ORDER BY sequence_column; -- Order by the generated column
```

The BY part tells PostgreSQL how to order items within a level (BFS) or siblings under a parent (DFS). SET names the new sorting column.

#### **Example (DFS using SEARCH, ordering siblings by name)**

```sql
WITH RECURSIVE EmployeeHierarchy AS (
    -- Anchor Member
    SELECT employee_id, name, manager_id, 1 AS level
    FROM employees WHERE employee_id = 1
    UNION ALL
    -- Recursive Member
    SELECT e.employee_id, e.name, e.manager_id, eh.level + 1
    FROM employees e JOIN EmployeeHierarchy eh ON e.manager_id = eh.employee_id
)
-- Specify DFS order, sorting siblings alphabetically by name
SEARCH DEPTH FIRST BY name SET sort_seq
-- Final query ordered by the generated sequence column
SELECT employee_id, name, manager_id, level FROM EmployeeHierarchy ORDER BY sort_seq;
```

Using SEARCH is the recommended way to handle ordering in recursive queries in PostgreSQL.

### Conclusion

CTEs (WITH and WITH RECURSIVE) are powerful tools in PostgreSQL for making complex queries more readable and manageable. They help structure your logic, allow reuse within a query, and provide a standard way to handle hierarchical data using recursion and the SEARCH clause. Using CTEs effectively leads to better, more understandable SQL code.
