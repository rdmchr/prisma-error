import { extendType, inputObjectType, objectType } from "nexus";
import { Ingredient } from "nexus-prisma";

export const ingredientSchema = objectType({
  name: Ingredient.$name,
  description: Ingredient.$description,
  definition(t) {
    t.field(Ingredient.id);
    t.field(Ingredient.name);
    t.field(Ingredient.unit);
    t.field(Ingredient.amount);
    t.field(Ingredient.recipe);
  },
});

export const ingredientInputType = inputObjectType({
  name: "IngredientInput",
  definition(t) {
    t.nonNull.string("name");
    t.string("unit");
    t.nonNull.float("amount");
  },
});

export const ingredientQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("ingredient", {
      type: Ingredient.$name,
      args: {
        id: "String",
      },
      // @ts-ignore
      resolve: async (_parent, { id }, ctx) => {
        if (!id) {
          return null;
        }
        return await ctx.prisma.ingredient.findUnique({
          where: {
            id,
          },
        });
      },
    });
  },
});

export const ingredientMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createIngredient", {
      type: "Ingredient",
      args: {
        name: "String",
        unit: "String",
        amount: "Int",
        recipe: "String",
      },
      resolve: (_parent, args, ctx) => {
        if (!args.name || !args.unit || !args.amount || !args.recipe) {
          throw new Error("Missing required fields");
        }
        return ctx.prisma.ingredient.create({
          data: {
            name: args.name,
            unit: args.unit,
            amount: args.amount,
          },
        });
      },
    });
  },
});
