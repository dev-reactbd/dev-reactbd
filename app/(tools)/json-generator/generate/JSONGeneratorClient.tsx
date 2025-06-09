"use client";

import { useState, useEffect } from "react";
import {
  Download,
  Copy,
  Plus,
  X,
  Palette,
  WrapText,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Utility functions for fake data generation
const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const generateRandomName = () => {
  const firstNames = [
    "John",
    "Jane",
    "Michael",
    "Sarah",
    "David",
    "Emily",
    "Chris",
    "Jessica",
    "Daniel",
    "Ashley",
    "Alex",
    "Taylor",
    "Jordan",
    "Casey",
    "Morgan",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Wilson",
    "Anderson",
    "Thomas",
    "Jackson",
    "White",
  ];
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
    lastNames[Math.floor(Math.random() * lastNames.length)]
  }`;
};

const generateRandomEmail = (name?: string) => {
  const domains = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "example.com",
  ];
  const username = name
    ? name.toLowerCase().replace(" ", ".")
    : `user${Math.floor(Math.random() * 1000)}`;
  return `${username}@${domains[Math.floor(Math.random() * domains.length)]}`;
};

const generateRandomProduct = () => {
  const products = [
    "Laptop",
    "Smartphone",
    "Headphones",
    "Tablet",
    "Watch",
    "Camera",
    "Speaker",
    "Monitor",
    "Keyboard",
    "Mouse",
    "Charger",
    "Case",
    "Stand",
    "Cable",
    "Adapter",
  ];
  const adjectives = [
    "Premium",
    "Pro",
    "Ultra",
    "Smart",
    "Wireless",
    "Portable",
    "Advanced",
    "Digital",
    "HD",
    "Gaming",
    "Professional",
    "Compact",
    "Ergonomic",
    "High-Speed",
    "Durable",
  ];
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${
    products[Math.floor(Math.random() * products.length)]
  }`;
};

const generateRandomCategory = () => {
  const categories = [
    "Electronics",
    "Clothing",
    "Books",
    "Home & Garden",
    "Sports",
    "Toys",
    "Beauty",
    "Automotive",
    "Food",
    "Health",
    "Office",
    "Gaming",
    "Music",
    "Art",
    "Travel",
  ];
  return categories[Math.floor(Math.random() * categories.length)];
};

const generateRandomTitle = () => {
  const titles = [
    "Getting Started with React",
    "10 Tips for Better Code",
    "Understanding JavaScript",
    "Web Development Best Practices",
    "Building Modern Applications",
    "Design Patterns Explained",
    "API Development Guide",
    "Database Optimization",
    "Security Best Practices",
    "Performance Optimization",
  ];
  return titles[Math.floor(Math.random() * titles.length)];
};

const generateRandomContent = () => {
  const contents = [
    "This is a comprehensive guide that covers all the essential concepts you need to know.",
    "Learn the fundamentals and advanced techniques with practical examples and real-world applications.",
    "Discover best practices and common pitfalls to avoid in your development journey.",
    "A detailed walkthrough with step-by-step instructions and helpful tips.",
    "Everything you need to know to get started and become proficient in this topic.",
  ];
  return contents[Math.floor(Math.random() * contents.length)];
};

const generateRandomRecipe = () => {
  const recipes = [
    "Chocolate Chip Cookies",
    "Spaghetti Carbonara",
    "Chicken Tikka Masala",
    "Caesar Salad",
    "Beef Tacos",
    "Vegetable Stir Fry",
    "Banana Bread",
    "Grilled Salmon",
    "Mushroom Risotto",
    "Apple Pie",
  ];
  return recipes[Math.floor(Math.random() * recipes.length)];
};

const generateRandomIngredient = () => {
  const ingredients = [
    "2 cups flour",
    "1 cup sugar",
    "3 eggs",
    "1/2 cup butter",
    "1 tsp vanilla",
    "1 cup milk",
    "2 tbsp olive oil",
    "1 onion, diced",
    "2 cloves garlic",
    "Salt and pepper to taste",
  ];
  return ingredients[Math.floor(Math.random() * ingredients.length)];
};

const generateUserImage = (name: string) => {
  const encodedName = encodeURIComponent(name);
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodedName}`;
};

const generateProductImage = (product: string) => {
  const productImages = [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop",
  ];
  return productImages[Math.floor(Math.random() * productImages.length)];
};

const generateRecipeImage = () => {
  const recipeImages = [
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=300&h=300&fit=crop",
  ];
  return recipeImages[Math.floor(Math.random() * recipeImages.length)];
};

// JSON Syntax Highlighter Component
const JSONHighlighter = ({
  json,
  colored,
}: {
  json: string;
  colored: boolean;
}) => {
  if (!colored) {
    return <code className="text-sm">{json}</code>;
  }

  const highlightJSON = (jsonString: string) => {
    return jsonString.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (match) => {
        let cls = "text-orange-600 dark:text-orange-400"; // numbers
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "text-blue-600 dark:text-blue-400 font-medium"; // keys
          } else {
            cls = "text-green-600 dark:text-green-400"; // strings
          }
        } else if (/true|false/.test(match)) {
          cls = "text-purple-600 dark:text-purple-400"; // booleans
        } else if (/null/.test(match)) {
          cls = "text-red-600 dark:text-red-400"; // null
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
  };

  return (
    <code
      className="text-sm"
      dangerouslySetInnerHTML={{
        __html: highlightJSON(json),
      }}
    />
  );
};

interface CustomField {
  id: string;
  name: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "email"
    | "url"
    | "date"
    | "array"
    | "object";
  min?: number;
  max?: number;
  length?: number;
  isDefault?: boolean;
}

// Sortable Field Item Component
function SortableFieldItem({
  field,
  onRemove,
}: {
  field: CustomField;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center justify-between p-3 rounded-lg cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-50 border-2 border-primary shadow-lg" : ""
      } ${
        field.isDefault
          ? "bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-950/30"
          : "bg-muted hover:bg-muted/80"
      } transition-colors`}
    >
      <div className="flex items-center space-x-2 pointer-events-none">
        <GripVertical className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium">{field.name}</span>
        <span className="text-muted-foreground">({field.type})</span>
        {field.isDefault && (
          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
            Default
          </span>
        )}
        {field.type === "number" &&
          field.min !== undefined &&
          field.max !== undefined && (
            <span className="text-xs text-muted-foreground">
              ({field.min}-{field.max})
            </span>
          )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className={`pointer-events-auto ${
          field.isDefault ? "text-blue-600 hover:text-blue-800" : ""
        }`}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}

export default function JSONGeneratorClient() {
  const [dataType, setDataType] = useState("users");
  const [outputFormat, setOutputFormat] = useState<"array" | "object">("array");
  const [recordCount, setRecordCount] = useState(10);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [generatedJSON, setGeneratedJSON] = useState("");
  const [newField, setNewField] = useState<CustomField>({
    id: "",
    name: "",
    type: "string",
  });
  const [copied, setCopied] = useState(false);
  const [syntaxHighlighting, setSyntaxHighlighting] = useState(true);
  const [lineWrap, setLineWrap] = useState(false);

  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Get default fields for each data type
  const getDefaultFields = (type: string): CustomField[] => {
    const defaultFields: Record<string, CustomField[]> = {
      users: [
        { id: "user-id", name: "id", type: "string", isDefault: true },
        { id: "user-name", name: "name", type: "string", isDefault: true },
        { id: "user-email", name: "email", type: "email", isDefault: true },
        { id: "user-avatar", name: "avatar", type: "url", isDefault: true },
        {
          id: "user-age",
          name: "age",
          type: "number",
          min: 18,
          max: 80,
          isDefault: true,
        },
      ],
      products: [
        { id: "product-id", name: "id", type: "string", isDefault: true },
        { id: "product-name", name: "name", type: "string", isDefault: true },
        {
          id: "product-price",
          name: "price",
          type: "number",
          min: 10,
          max: 999,
          isDefault: true,
        },
        {
          id: "product-category",
          name: "category",
          type: "string",
          isDefault: true,
        },
        { id: "product-image", name: "image", type: "url", isDefault: true },
        {
          id: "product-inStock",
          name: "inStock",
          type: "boolean",
          isDefault: true,
        },
      ],
      todos: [
        { id: "todo-id", name: "id", type: "string", isDefault: true },
        { id: "todo-title", name: "title", type: "string", isDefault: true },
        {
          id: "todo-completed",
          name: "completed",
          type: "boolean",
          isDefault: true,
        },
        {
          id: "todo-priority",
          name: "priority",
          type: "string",
          isDefault: true,
        },
        { id: "todo-dueDate", name: "dueDate", type: "date", isDefault: true },
      ],
      posts: [
        { id: "post-id", name: "id", type: "string", isDefault: true },
        { id: "post-title", name: "title", type: "string", isDefault: true },
        {
          id: "post-content",
          name: "content",
          type: "string",
          isDefault: true,
        },
        { id: "post-author", name: "author", type: "string", isDefault: true },
        {
          id: "post-publishedAt",
          name: "publishedAt",
          type: "date",
          isDefault: true,
        },
        { id: "post-tags", name: "tags", type: "array", isDefault: true },
      ],
      comments: [
        { id: "comment-id", name: "id", type: "string", isDefault: true },
        {
          id: "comment-postId",
          name: "postId",
          type: "string",
          isDefault: true,
        },
        {
          id: "comment-author",
          name: "author",
          type: "string",
          isDefault: true,
        },
        {
          id: "comment-content",
          name: "content",
          type: "string",
          isDefault: true,
        },
        {
          id: "comment-createdAt",
          name: "createdAt",
          type: "date",
          isDefault: true,
        },
      ],
      categories: [
        { id: "category-id", name: "id", type: "string", isDefault: true },
        { id: "category-name", name: "name", type: "string", isDefault: true },
        {
          id: "category-description",
          name: "description",
          type: "string",
          isDefault: true,
        },
        {
          id: "category-parentId",
          name: "parentId",
          type: "string",
          isDefault: true,
        },
        {
          id: "category-itemCount",
          name: "itemCount",
          type: "number",
          min: 0,
          max: 1000,
          isDefault: true,
        },
      ],
      carts: [
        { id: "cart-id", name: "id", type: "string", isDefault: true },
        { id: "cart-userId", name: "userId", type: "string", isDefault: true },
        { id: "cart-items", name: "items", type: "array", isDefault: true },
        {
          id: "cart-total",
          name: "total",
          type: "number",
          min: 0,
          max: 9999,
          isDefault: true,
        },
        {
          id: "cart-createdAt",
          name: "createdAt",
          type: "date",
          isDefault: true,
        },
      ],
      recipes: [
        { id: "recipe-id", name: "id", type: "string", isDefault: true },
        { id: "recipe-name", name: "name", type: "string", isDefault: true },
        {
          id: "recipe-description",
          name: "description",
          type: "string",
          isDefault: true,
        },
        {
          id: "recipe-ingredients",
          name: "ingredients",
          type: "array",
          isDefault: true,
        },
        {
          id: "recipe-instructions",
          name: "instructions",
          type: "string",
          isDefault: true,
        },
        {
          id: "recipe-cookingTime",
          name: "cookingTime",
          type: "number",
          min: 5,
          max: 180,
          isDefault: true,
        },
        {
          id: "recipe-servings",
          name: "servings",
          type: "number",
          min: 1,
          max: 12,
          isDefault: true,
        },
        { id: "recipe-image", name: "image", type: "url", isDefault: true },
      ],
    };
    return defaultFields[type] || [];
  };

  // Initialize default fields when data type changes
  useEffect(() => {
    const defaultFields = getDefaultFields(dataType);
    const userCustomFields = customFields.filter((field) => !field.isDefault);
    setCustomFields([...defaultFields, ...userCustomFields]);
  }, [dataType]);

  // Handle output format changes with proper record count defaults
  useEffect(() => {
    if (outputFormat === "object") {
      setRecordCount(1);
    } else if (outputFormat === "array") {
      setRecordCount(10);
    }
  }, [outputFormat]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCustomFields((fields) => {
        const oldIndex = fields.findIndex((field) => field.id === active.id);
        const newIndex = fields.findIndex((field) => field.id === over.id);

        return arrayMove(fields, oldIndex, newIndex);
      });
    }
  };

  const generateData = () => {
    const data = [];
    // Use current fields (including removed defaults) or fallback to defaults if no fields exist
    const fieldsToUse =
      customFields.length > 0 ? customFields : getDefaultFields(dataType);

    for (let i = 0; i < recordCount; i++) {
      let record: any = {};

      // Only generate base data if we have default fields or if fields include the base properties
      const hasDefaultFields = fieldsToUse.some((field) => field.isDefault);

      if (hasDefaultFields) {
        if (dataType === "users") {
          const name = generateRandomName();
          record = {
            id: generateUUID(),
            name,
            email: generateRandomEmail(name),
            avatar: generateUserImage(name),
            age: Math.floor(Math.random() * 62) + 18,
          };
        } else if (dataType === "products") {
          const productName = generateRandomProduct();
          record = {
            id: generateUUID(),
            name: productName,
            price: Math.floor(Math.random() * 990) + 10,
            category: generateRandomCategory(),
            image: generateProductImage(productName),
            inStock: Math.random() > 0.2,
          };
        } else if (dataType === "todos") {
          record = {
            id: generateUUID(),
            title: `Task ${i + 1}: ${generateRandomTitle()
              .split(" ")
              .slice(0, 3)
              .join(" ")}`,
            completed: Math.random() > 0.7,
            priority: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
            dueDate: new Date(
              Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000
            )
              .toISOString()
              .split("T")[0],
          };
        } else if (dataType === "posts") {
          record = {
            id: generateUUID(),
            title: generateRandomTitle(),
            content: generateRandomContent(),
            author: generateRandomName(),
            publishedAt: new Date(
              Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
            ).toISOString(),
            tags: [
              "javascript",
              "react",
              "web-dev",
              "tutorial",
              "programming",
            ].slice(0, Math.floor(Math.random() * 3) + 1),
          };
        } else if (dataType === "comments") {
          record = {
            id: generateUUID(),
            postId: generateUUID(),
            author: generateRandomName(),
            content: "This is a sample comment with some meaningful content.",
            createdAt: new Date(
              Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
          };
        } else if (dataType === "categories") {
          record = {
            id: generateUUID(),
            name: generateRandomCategory(),
            description: `Category for ${generateRandomCategory().toLowerCase()} items`,
            parentId: Math.random() > 0.5 ? generateUUID() : null,
            itemCount: Math.floor(Math.random() * 1000),
          };
        } else if (dataType === "carts") {
          const itemCount = Math.floor(Math.random() * 5) + 1;
          const items = Array.from({ length: itemCount }, () => ({
            productId: generateUUID(),
            name: generateRandomProduct(),
            quantity: Math.floor(Math.random() * 3) + 1,
            price: Math.floor(Math.random() * 100) + 10,
          }));
          record = {
            id: generateUUID(),
            userId: generateUUID(),
            items,
            total: items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            ),
            createdAt: new Date().toISOString(),
          };
        } else if (dataType === "recipes") {
          record = {
            id: generateUUID(),
            name: generateRandomRecipe(),
            description:
              "A delicious and easy-to-make recipe perfect for any occasion.",
            ingredients: Array.from(
              { length: Math.floor(Math.random() * 5) + 3 },
              () => generateRandomIngredient()
            ),
            instructions:
              "Mix all ingredients together and cook according to the recipe instructions.",
            cookingTime: Math.floor(Math.random() * 175) + 5,
            servings: Math.floor(Math.random() * 11) + 1,
            image: generateRecipeImage(),
          };
        }
      }

      // Generate data only for the fields that exist in customFields, respecting their order
      const finalRecord: any = {};
      fieldsToUse.forEach((field) => {
        if (field.isDefault && record.hasOwnProperty(field.name)) {
          finalRecord[field.name] = record[field.name];
        } else if (!field.isDefault) {
          switch (field.type) {
            case "string":
              finalRecord[field.name] = `Sample ${field.name} ${i + 1}`;
              break;
            case "number":
              const min = field.min || 0;
              const max = field.max || 100;
              finalRecord[field.name] =
                Math.floor(Math.random() * (max - min + 1)) + min;
              break;
            case "boolean":
              finalRecord[field.name] = Math.random() > 0.5;
              break;
            case "email":
              finalRecord[field.name] = generateRandomEmail();
              break;
            case "url":
              finalRecord[field.name] = `https://example.com/${field.name}/${
                i + 1
              }`;
              break;
            case "date":
              finalRecord[field.name] = new Date(
                Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
              )
                .toISOString()
                .split("T")[0];
              break;
            case "array":
              finalRecord[field.name] = [`item1`, `item2`, `item3`];
              break;
            case "object":
              finalRecord[field.name] = { key: "value", nested: true };
              break;
          }
        }
      });

      data.push(finalRecord);
    }

    // Format output based on selection
    let output;
    if (outputFormat === "array") {
      output = data;
    } else {
      // Object format with keys as IDs
      output = {};
      data.forEach((item, index) => {
        const key = item.id || `item_${index + 1}`;
        output[key] = item;
      });
    }

    setGeneratedJSON(JSON.stringify(output, null, 2));
  };

  const addCustomField = () => {
    if (newField.name) {
      const fieldId = `custom-${newField.name}-${Date.now()}`;
      setCustomFields([...customFields, { ...newField, id: fieldId }]);
      setNewField({ id: "", name: "", type: "string" });
    }
  };

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedJSON);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJSON = () => {
    const blob = new Blob([generatedJSON], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${dataType}-data.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">JSON Data Generator</h1>
        <p className="text-xl text-muted-foreground">
          Generate realistic fake JSON data for testing and prototyping
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <Card className="h-fit lg:h-[800px] flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="dataType">Data Type</Label>
                <Select value={dataType} onValueChange={setDataType}>
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="users">Users</SelectItem>
                    <SelectItem value="products">Products</SelectItem>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="posts">Posts</SelectItem>
                    <SelectItem value="comments">Comments</SelectItem>
                    <SelectItem value="categories">Categories</SelectItem>
                    <SelectItem value="carts">Shopping Carts</SelectItem>
                    <SelectItem value="recipes">Recipes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="outputFormat">Output Format</Label>
                <Select
                  value={outputFormat}
                  onValueChange={(value: "array" | "object") =>
                    setOutputFormat(value)
                  }
                >
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="array">Array</SelectItem>
                    <SelectItem value="object">Object</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="recordCount" className="mb-2">
                  {outputFormat === "array"
                    ? "Number of Records"
                    : "Number of Objects"}
                </Label>
                <Input
                  type="number"
                  value={recordCount}
                  onChange={(e) =>
                    setRecordCount(
                      Math.max(1, Number.parseInt(e.target.value) || 1)
                    )
                  }
                  min="1"
                  max="1000"
                />
                {outputFormat === "object" && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Each record becomes a separate object with unique keys
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Fields Configuration</h3>

              {/* Show current fields with drag and drop */}
              {customFields.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Current Fields:</h4>
                    <p className="text-xs text-muted-foreground">
                      Click and drag anywhere to reorder
                    </p>
                  </div>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={customFields.map((field) => field.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                        {customFields.map((field, index) => (
                          <SortableFieldItem
                            key={field.id}
                            field={field}
                            onRemove={() => removeCustomField(index)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}

              {customFields.length === 0 && (
                <div className="text-center text-muted-foreground py-8 border-2 border-dashed border-muted rounded-lg">
                  <div className="text-2xl mb-2">📝</div>
                  <p>No fields configured</p>
                  <p className="text-sm">
                    Add custom fields below to generate data
                  </p>
                </div>
              )}

              {/* Add new field */}
              <div className="space-y-3 p-4 border rounded-lg">
                <h4 className="font-medium">Add Custom Field:</h4>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Field name"
                      value={newField.name}
                      onChange={(e) =>
                        setNewField({ ...newField, name: e.target.value })
                      }
                      className="flex-1"
                    />
                    <Select
                      value={newField.type}
                      onValueChange={(value: any) =>
                        setNewField({ ...newField, type: value })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string">String</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="boolean">Boolean</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="url">URL</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="array">Array</SelectItem>
                        <SelectItem value="object">Object</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={addCustomField} size="icon">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {newField.type === "number" && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Min value"
                        type="number"
                        value={newField.min || ""}
                        onChange={(e) =>
                          setNewField({
                            ...newField,
                            min: Number.parseInt(e.target.value) || undefined,
                          })
                        }
                      />
                      <Input
                        placeholder="Max value"
                        type="number"
                        value={newField.max || ""}
                        onChange={(e) =>
                          setNewField({
                            ...newField,
                            max: Number.parseInt(e.target.value) || undefined,
                          })
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button onClick={generateData} className="w-full" size="lg">
              Generate JSON Data
            </Button>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="h-fit lg:h-[800px] flex flex-col">
          <CardHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle>Generated JSON</CardTitle>
              <div className="flex items-center gap-2">
                {generatedJSON && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadJSON}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </>
                )}
              </div>
            </div>
            {/* Display Options */}
            {generatedJSON && (
              <div className="flex items-center gap-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Palette className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="syntax-highlighting" className="text-sm">
                    Syntax Highlighting
                  </Label>
                  <Switch
                    id="syntax-highlighting"
                    checked={syntaxHighlighting}
                    onCheckedChange={setSyntaxHighlighting}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <WrapText className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="line-wrap" className="text-sm">
                    Line Wrap
                  </Label>
                  <Switch
                    id="line-wrap"
                    checked={lineWrap}
                    onCheckedChange={setLineWrap}
                  />
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            {generatedJSON ? (
              <div className="h-full overflow-auto">
                <pre
                  className={`p-4 text-sm h-full ${
                    lineWrap
                      ? "whitespace-pre-wrap break-words"
                      : "whitespace-pre"
                  } ${!lineWrap ? "overflow-x-auto" : ""}`}
                  style={{
                    fontFamily:
                      "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
                  }}
                >
                  <JSONHighlighter
                    json={generatedJSON}
                    colored={syntaxHighlighting}
                  />
                </pre>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                <div>
                  <div className="text-4xl mb-4">📄</div>
                  <p>Click "Generate JSON Data" to create your data</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <Alert>
        <AlertDescription>
          <strong>Tip:</strong> Drag and drop fields to reorder them - the
          generated JSON will follow your custom order. You can remove all
          fields including defaults and add your own custom fields in any order
          you prefer.
        </AlertDescription>
      </Alert>
    </div>
  );
}
